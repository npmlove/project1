module.exports = {
  webpackBarName: 'vue-admin-beautiful',
  webpackBanner:
    ' build: vue-admin-beautiful \n vue-admin-beautiful author: chuzhixin 1204505056@qq.com \n vue-admin-beautiful QQ Group(QQ群): 972435319、1139183756 \n time: ',
  donationConsole() {
    const chalk = require('chalk')
    console.log(
      chalk.green(
        `> 欢迎使用vue-admin-beautiful，开源地址：https://github.com/chuzhixin/vue-admin-beautiful`
      )
    )

    console.log(
      chalk.green(
        `> pro版演示地址：http://chu1204505056.gitee.io/admin-pro?hmsr=console&hmpl=&hmcu=&hmkw=&hmci=`
      )
    )

    console.log(
      chalk.green(
        `> 使用中出现任何问题可加QQ群反馈，获取基础版、文档，请我们喝杯咖啡（如若情况不允许，请勿勉强）：https://gitee.com/chu1204505056/vue-admin-beautiful#vue-admin-beautiful-%E5%89%8D%E7%AB%AF%E8%AE%A8%E8%AE%BA-qq-%E7%BE%A4`
      )
    )

    console.log(chalk.green(`> 如果您不希望显示以上信息，可在config中配置关闭`))
    console.log('\n')
  },
}
