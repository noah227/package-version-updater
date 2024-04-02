const path = require("path")
const fs = require("fs")
const {list: templateList} = require("./template.json");

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
    const {
        raw, major, minor, patch, prerelease
    } = require("semver").parse(version)
    let prereleaseCode, prereleaseVersion
    const l = prerelease.length
    if(l) {
        const p1 = prerelease[0]
        if(l === 1) {
            if(isNaN(parseInt(p1))) {}
            else prereleaseVersion = p1
        }
        else if(l > 1) {
            const p2 = prerelease[1]
            prereleaseCode = p1
            prereleaseVersion = p2
        }
    }
    return {
        major, minor, patch,
        prereleaseCode, prereleaseVersion
    }
}

// const prevReg = /^([a-zA-Z]+-?)?/
const prevReg = /^([a-zA-Z]+)?/
const matchPrev = ({version}) => {
    const match = prevReg.exec(version)
    if (match) return match[0]
}

/**
 * render localed version string
 * @param oldVersion
 * @param newVersion
 * @param locale
 * @return {string}
 */
const renderVersionMessage = (oldVersion, newVersion, locale = null) => {
    const {osLocaleSync} = require("os-locale-ex")
    const templateList = require("./template.json").list
    locale = locale || osLocaleSync() || "en-US"
    let matched = templateList.find(item => item.locale === locale)
    if (!matched) {
        console.warn(`Locale pattern [${locale}] not found in template, use en-US as default.`)
        matched = templateList.find(item => item.locale === "en-US")
    }
    return matched.tpl.replaceAll("@oldVersion", oldVersion).replaceAll("@newVersion", newVersion)
}

/**
 *
 * @param { {
 *      major?: boolean | number, minor?: boolean | number, patch?: boolean | number,
 *      preRelease?: boolean | number,
 *      autoCommit?: boolean, commitPrefix?: string,
 *      locale?: string,
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
        const _ = []
        if(prereleaseCode) _.push(prereleaseCode)
        if(prereleaseVersion) _.push(0)
        if(_.length) _version += "-" + _.join(".")
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
    const prev = matchPrev(pkg)
    if (prev) _version = prev + _version
    let updateMsg = renderVersionMessage(pkg.version, _version, options.locale)
    if (preview) {
        return console.log("[Preview Mode] ", updateMsg)
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
