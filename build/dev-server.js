//这里是将package.json中的engine要求的node，npm版本号和本地版本相比对，如果不符合就会在命令行用红色和绿色的文字发出警告
require('./check-versions')()
// 获取配置
var config = require('../config')

// 如果Node的环境变量中没有设置当前的环境（NODE_ENV），则使用config中的配置作为当前的环境
// 判断开发环境
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}
// 一个可以调用默认软件打开指定url的插件
// 这里用它来调用默认浏览器打开dev-server监听的端口，例如：localhost:8080
var opn = require('opn')
// 引入nodejs的path模块，进行一些路径的操作，详情可以查看node官方的api
var path = require('path')
// Express是目前最流行的基于Node.js的Web开发框架，可以搭建开发环境下的服务器
var express = require('express')
//资源打包模块 github https://github.com/webpack/webpack
var webpack = require('webpack')

 // express中间件 一个可以设置帮助我们进行服务器转发代理的中间件
var proxyMiddleware = require('http-proxy-middleware')

// 根据当前启动环境选择加载相应的配置文件
//process是nodejs中的一个全局对象，可以看作一个进程，这个procee.env中保存着当前shell的环境变量
//这里是如果这个环境变量中没有NODE_ENV这个属性，就将它的值设为开发模式development，相对的还有生产模式production
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
//端口号设置
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false

// 用于判断是否要自动打开浏览器的布尔变量，当配置文件中没有设置自动打开浏览器的时候其值为 false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware

//  获取需要代理的服务api
var proxyTable = config.dev.proxyTable

// 创建1个 express 实例
var app = express()

// 根据webpack配置文件创建Compiler对象
var compiler = webpack(webpackConfig)

// webpack-dev-middleware使用compiler对象来对相应的文件进行编译和绑定
// webpack的开发中间件，可以让文件都加载内存中，
// 不去读写硬盘，并且当文件被改动的时候，不会刷新页面就会部署成功
var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

// webpack-hot-middleware，用于实现热重载功能的中间件 它可以实现浏览器的无刷新更新（hot reload）。
var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {}
})
//  当html被改变的时候，让html被强制部署，使用这个中间件html-webpack-plugin，
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
//遍历代理的配置信息,并且使用中间件加载进去
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
    // 将 proxyTable 中的代理请求配置挂在到express服务器上
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
// 重定向不存在的URL，常用于SPA
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
// 使用webpack开发中间件
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
// 将热重载中间件挂在到express服务器上
app.use(hotMiddleware)

// serve pure static assets
// 根据配置信息拼接一个目录路径，然后将该路径下的文件交给express的静态目录管理
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

// 应用的地址信息，例如：http://localhost:8080
var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')

// webpack开发中间件合法（valid）之后输出提示语到控制台，表明服务器已启动
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
    // 如果符合自动打开浏览器的条件，则通过opn插件调用系统默认浏览器打开对应的地址uri
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// 启动express服务器并监听相应的端口（8080）
var server = app.listen(port)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
