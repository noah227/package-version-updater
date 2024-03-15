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
    .option("-M, --major <delta>", "update Major", "0")
    .option("-m, --minor <delta>", "update Minor", "0")
    .option("-p, --patch <delta>", "update Patch", "0")
    .action((options) => {
        require("./core")(options)
    })

// 执行参数处理
program.parse()
