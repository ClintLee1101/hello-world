var path = require('path')
// 工具类，下面会用到
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var webpack = require('webpack')

// 给出正确的绝对路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
    // 配置webpack编译入口
  entry: {
    app: './src/main.js'
  },
  output: {
      // webpack输出的目标文件夹路径（/dist）
    path: config.build.assetsRoot,
    filename: '[name].js',
      // webpack编译输出的发布路径
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
    // 配置模块resolve的规则
  resolve: {
      // 当使用require或者import的时候，自动补全下面的扩展名文件的扩展名，
      // 也就是说引入的时候不需要使用扩展名
    extensions: ['.js', '.vue', '.json','scss'],
      //别名,在我们require的时候，可以使用这些别名，来缩短我们需要的路径的长度
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },

  module: {
      //include是包含的文件，exclude是排除的文件，可以使用的正则
      // 这里也是相应的配置，test就是匹配文件，loader是加载器，
      // 文件名的生成规则是utils提供的方法，当小于10kb的时候，就会生成一个base64串放入js文件中
    rules: [
        // 配置不同类型模块的处理规则
      {
          // 对所有.vue文件使用vue-loader
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {// 对src和test文件夹下的.js文件使用babel-loader
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('static')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        },
          include: [resolve('src'), resolve('static')]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 4000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        },
          include: [resolve('src'), resolve('static')]
       }
    ]
  },
    //引入jquery插件
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.ProvidePlugin({
            jQuery: "jquery",
            $: "jquery"
        })
    ]
}
