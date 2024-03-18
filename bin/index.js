#!/usr/bin/env node

const {Command} = require("commander")
const program = new Command()
// const {chalk} = require("@vue/cli-shared-utils")
// console.log(chalk.greenBright("~⭐@VXT/CLI POWERED"))

// 注册版本及描述信息
program
    .name("pvu")
    .description("version updater for package.json")
    .version(`pvu ${require("../package.json").version}`)

// 注册支持的命令及执行函数
program
    .description("update version")
    .option("-M, --major [delta]", "update Major", parseInt, 0)
    .option("-m, --minor [delta]", "update Minor", parseInt, 0)
    .option("-p, --patch [delta]", "update Patch", parseInt, 0)
    .option("-pr, --pre-release [delta]", "update Pre-Release (alpha/beta/rc/...)", parseInt, 0)
    .option("-ac, --auto-commit", "auto commit package.json if it's a git repo")
    .option("-cp, --commit-prefix [commit-prefix]", "commit prefix", "chore")
    .option("--preview", "output result in console only, no actual operation to package.json")
    .action((options) => {
        require("./core")(options)
    })

// 执行参数处理
program.parse()
