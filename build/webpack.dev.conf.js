var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
// 提供一个合并生成新对象函数
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// add hot-reload related code to entry chunks
//// 在浏览器不刷新的情况下，也可以看到改变的效果，如果刷新失败了，他就会自动刷新页面
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

module.exports = merge(baseWebpackConfig, {
  module: {
    //这里是对单独的css文件，用相应的css加载器来解析
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap })//将所有样式插入页面style中
  },
  // cheap-module-eval-source-map is faster for development
    // 在开发模式下，可以在webpack下面找到js文件，在f12的时候，  sources面板下
  devtool: '#cheap-module-eval-source-map',
    // 将webpack的插件放入
  plugins: [
      // 通过插件修改定义的变量
    new webpack.DefinePlugin({
      'process.env': config.dev.env
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
      // 当编译出现错误的时候，会跳过这部分代码
    new webpack.NoEmitOnErrorsPlugin(),
    //filename生成的文件名，template是模版用的文件名 https://github.com/ampedandwired/html-webpack-plugin
      //对生成的html文件进行配置
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
        // 让打包生成的html文件中css和js就默认添加到html里面，css就添加到head里面，js就添加到body里面
      inject: true
    }),
    new FriendlyErrorsPlugin()
  ]
})

