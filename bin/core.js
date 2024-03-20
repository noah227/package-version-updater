const path = require("path")
const fs = require("fs")
const versionConverter = require("version-converter")

/**
 *
 * @param {boolean | number} v
 */
const processValue = (v) => {
    return typeof v === "boolean" ? 1 : v
}
/**
 * @param {{version: string, [index: string]: any}} pkg
 */
const processVersion = ({version}) => {
    return versionConverter.split(version)
}

/**
 *
 * @param { {
 *      major?: boolean | number, minor?: boolean | number, patch?: boolean | number,
 *      preRelease?: boolean | number,
 *      autoCommit?: boolean, commitPrefix?: string,
 *      preview?: boolean
 * }} options
 */
module.exports = (options) => {
    console.log("Input:", JSON.stringify(options))
    // 处理参数
    let {major, minor, patch, preRelease, preview} = options
    major = processValue(major)
    minor = processValue(minor)
    patch = processValue(patch)
    preRelease = processValue(preRelease)


    if (!major && !minor && !preRelease && !patch) patch = 1

    // 获取cwd及pkg信息
    const cwd = process.cwd()
    const pkgPath = path.resolve(cwd, "package.json")
    if (!fs.existsSync(pkgPath)) return console.error(`${pkgPath} does not exist`)

    // 处理要升级并更新pkg
    const pkg = require(pkgPath)
    let {major: M, minor: m, patch: p, prereleaseCode, prereleaseVersion} = processVersion(pkg)
    if (major) {
        M += major
        // 重置下级版本
        m = 0
        p = 0
    }
    if (minor) {
        m += minor
        p = 0
    }
    if (patch) p += patch

    // 版本主体部分
    let _version = [M, m, p].join(".")
    // 重置prerelease
    if (major || minor || patch) {
        _version += "-" + [prereleaseCode, 0].join(".")
    }
    // 处理prerelease
    else if (preRelease) {
        if (!prereleaseVersion) console.warn("Pre release version does not contain exact number, operation aborted!")
        else {
            _version += "-" + [
                prereleaseCode,
                (major || minor || patch) ? 0 : prereleaseVersion + preRelease
            ].join(".")
        }
    }
    let updateMsg = `Version updated: ${pkg.version} -> ${_version}`
    if (preview) {
        return console.log("Preview Mode:", updateMsg)
    } else console.log(updateMsg)
    pkg.version = _version
    // 执行文件操作
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: "utf8"})

    // 处理自动commit
    if (options.autoCommit) {
        // 简易的判断
        if (fs.existsSync(path.resolve(cwd, ".git"))) {
            const cmd = `git add package.json & git commit -m "${options.commitPrefix}: update version(${version} -> ${_version})"`
            require("child_process").exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.error(error)
                    console.error(stdout)
                    console.error(stderr)
                } else {
                    console.log("Version update@package.json has been automatically committed as you used --auto-commit")
                }
            })
        } else {
            console.log("It's not a git repository, nothing committed")
        }
    }
}
