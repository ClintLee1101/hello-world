// 下面是引入nodejs的路径模块
var path = require('path')
// 下面是utils工具配置文件，主要用来处理css类文件的loader
var utils = require('./utils')
// 下面引入webpack，来使用webpack内置插件
var webpack = require('webpack')
// 下面是config目录下的index.js配置文件，主要用来定义了生产和开发环境的相关基础配置
var config = require('../config')
// 下面是webpack的merger插件，主要用来处理配置对象合并的，可以将一个大的配置对象拆分成几个小的，合并，相同的项将覆盖
var merge = require('webpack-merge')
//用来处理不同类型文件的loader
var baseWebpackConfig = require('./webpack.base.conf')
// copy-webpack-plugin使用来复制文件或者文件夹到指定的目录的
var CopyWebpackPlugin = require('copy-webpack-plugin')
//生成自定义html页面 使用html模板
var HtmlWebpackPlugin = require('html-webpack-plugin')
// 主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
var ExtractTextPlugin = require('extract-text-webpack-plugin')
// optimize-css-assets-webpack-plugin插件的作用是压缩css代码的，还能去掉extract-text-webpack-plugin插件抽离文件产生的重复代码，
// 因为同一个css可能在多个模块中出现所以会导致重复代码
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : config.build.env

// 合并基础的webpack配置
var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({//css加载器，调用了utils文件中的styleLoaders方法,用来返回针对各类型的样式文件的处理方式
      sourceMap: config.build.productionSourceMap,
      extract: true //extract: true，此项是自定义项，设置为true表示，生成独立的文件
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
    // 配置webpack的输出
  output: {
      //打包后的文件放在dist目录里面
    path: config.build.assetsRoot, //通过HtmlWebpackPlugin插件生成的html文件存放在这个目录下面
      // 文件名称使用 ./static/js/[name].[chunkhash].js, 其中name就是main,chunkhash就是模块的hash值，用于浏览器缓存的
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
      // 没有指定输出名的文件输出的文件名格式
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
      // 压缩js代码
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false, // 禁止压缩时候的警告信息
        drop_console:true,//删除console
      },
        // 压缩后生成map文件
      sourceMap: true
    }),
    // extract css into its own file
      // 抽离css文件
    new ExtractTextPlugin({
        // 生成独立的css文件，下面是生成独立css文件的名称
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
        // 压缩css文件
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
      // 生成html页面
    new HtmlWebpackPlugin({
      filename: process.env.NODE_ENV === 'testing'
        ? 'index.html'
        : config.build.index,  //生成的HTML文件的名称
      template: 'index.html',
      inject: 'true',//inject :true | ‘head’ | ‘body’ | false 。把所有产出文件注入到给定的 template (index.html)。当传入 true或者 ‘body’时所有javascript资源将被放置在body元素的底部，“head”则会放在head元素内。
      minify: {
        removeComments: true,//移除注释
        // collapseWhitespace: true,//去掉空格
        // removeAttributeQuotes: true //去除属性引用
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // split vendor js into its own file
      // 以提取出多个代码块都依赖的模块形成一个单独的模块
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
      // 下面是复制文件的插件
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*'] //忽略拷贝指定的文件
      }
    ])
  ]
})

if (config.build.productionGzip) {
//开启Gzi压缩打包后的文件，把这个压缩包给浏览器，浏览器自动解压的
//vue-cli默认将这个神奇的功能禁用掉的，理由是Surge 和 Netlify 静态主机默认帮你把上传的文件gzip了
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
    // 打包编译后的文件打印出详细的文件信息，vue-cli默认把这个禁用了
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
