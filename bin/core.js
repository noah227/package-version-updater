const path = require("path")
const fs = require("fs")

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
    // 2.5.1-alpha.3
    const vSplit = version.split("-")
    // 正式version的部分
    const [M, m, p] = vSplit[0].split(".")
    let ret = {
        major: parseInt(M),
        minor: parseInt(m),
        patch: parseInt(p),
        preReleaseCode: undefined,
        preReleaseVersion: undefined,
    }
    // preRelease
    if (vSplit.length > 1) {
        const pvSplit = vSplit[1].split(".")
        if (pvSplit.length === 1) {
        } else {
            const [_, v] = pvSplit
            ret = {
                ...ret,
                preReleaseCode: _,
                preReleaseVersion: parseInt(v) || 0
            }
        }
    }

    return ret
}

/**
 *
 * @param { {
 *      major?: boolean | number, minor?: boolean | number, patch?: boolean | number,
 *      preRelease?: boolean | number,
 *      autoCommit?: boolean, commitPrefix?: string,
 * }} options
 */
module.exports = (options) => {
    console.log(options, 999)
    // 处理参数
    let {major, minor, patch, preRelease} = options
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

    console.log(processVersion(pkg))

    let {major: M, minor: m, patch: p, preReleaseCode, preReleaseVersion} = processVersion(pkg)
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

    let _version = [M, m, p].join(".")
    if (major || minor || patch) {
        _version += "-" + [preReleaseCode, 0].join(".")

    } else if (preRelease) {
        if (!preReleaseCode) console.warn("No pre-release part (e.g. -alpha.1) found in version")
        else if (!preReleaseVersion) console.warn("Pre release version does not contain exact number, operation aborted!")
        else {
            _version += "-" + [
                preReleaseCode,
                (major || minor || patch) ? 0 : preReleaseVersion + preRelease
            ].join(".")
        }
    }
    const updateMsg = `Version updated: ${pkg.version} -> ${_version}`
    console.log(updateMsg)

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
