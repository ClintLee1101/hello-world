require('./check-versions')()
//process是nodejs中的一个全局对象，可以看作一个进程，这个procee.env中保存着当前shell的环境变量
//这里是如果这个环境变量中没有NODE_ENV这个属性，就将它的值设为开发模式development，相对的还有生产模式production
process.env.NODE_ENV = 'production'

//命令行工具
var ora = require('ora')
// rimraf插件是用来执行UNIX命令rm和-rf的用来删除文件夹和文件，清空旧的文件
var rm = require('rimraf')
// node.js路径模块
var path = require('path')
// chalk插件，用来在命令行中输入不同颜色的文字
var chalk = require('chalk')
// 引入webpack模块使用内置插件和webpack方法
var webpack = require('webpack')
// 引入config下的index.js配置文件
var config = require('../config')
// 下面是生产模式的webpack配置文件
var webpackConfig = require('./webpack.prod.conf')
//命令行提示文字
var spinner = ora('building for production...')
spinner.start()
// 调用rm方法，第一个参数的结果就是 dist/static，表示删除这个路径下面的所有文件
rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    // 如果删除的过程中出现错误，就抛出这个错误，同时程序终止
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
