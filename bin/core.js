const path = require("path")
const fs = require("fs")
/**
 *
 * @param { {major?: String, minor?: String, patch?: String}} options
 */
module.exports = (options) => {
    console.log(options, 999)
    // 处理参数
    let {major, minor, patch} = options
    major = parseInt(major)
    minor = parseInt(minor)
    patch = parseInt(patch)

    if(!major && !minor && !patch) patch = 1

    // 获取cwd及pkg信息
    const cwd = process.cwd()
    const pkgPath = path.resolve(cwd, "package.json")
    if (!fs.existsSync(pkgPath)) return console.error(`${pkgPath} does not exist`)

    // 处理要升级并更新pkg
    const pkg = require(pkgPath)
    console.log(typeof pkg)
    const {version} = pkg
    let [M, m, p] = version.split(".")
    M = parseInt(M)
    m = parseInt(m)
    p = parseInt(p)

    if (major) M += major || 0
    if (minor) m += minor || 0
    if (patch) p += patch || 0
    const _version = [M, m, p].join(".")

    pkg.version = _version
    // 执行文件操作
    // fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), {encoding: "utf8"})

    const updateMsg = `Version updated: ${version} -> ${_version}`
    console.log(updateMsg)
}
