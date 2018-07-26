var path = require('path')
var config = require('../config')
//目的：用来将css提取到单独的css文件中
var ExtractTextPlugin = require('extract-text-webpack-plugin')
//导出assetsPath
exports.assetsPath = function (_path) {
    //生产环境assetsSubDirectory就是'./static'，否则是'static'
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
    // path.join和path.posix.join的区别就是，前者返回的是完整的路径，后者返回的是完整路径的相对根路径
    // 也就是说path.join的路径是C:a/a/b/xiangmu/b，那么path.posix.join就是b
  return path.posix.join(assetsSubDirectory, _path)
    // 所以这个方法的作用就是返回一个干净的相对根路径
}

exports.cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: 'css-loader',//处理css文件中的url    style-loader将css插入到页面的style标签
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
          // Object.assign是es6的方法，主要用来合并对象的
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',//编译后用什么loader来提取css文件
        publicPath:'../../'   //用来覆盖项目路径,生成该css文件的文件路径
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
      css: generateLoaders(), // css对应 vue-style-loader 和 css-loader
      postcss: generateLoaders(), // postcss对应 vue-style-loader 和 css-loader
      less: generateLoaders('less'), // less对应 vue-style-loader 和 less-loader
      sass: generateLoaders('sass', { indentedSyntax: true }), // sass对应 vue-style-loader 和 sass-loader
      scss: generateLoaders('sass'), // scss对应 vue-style-loader 和 sass-loader
      stylus: generateLoaders('stylus'), // stylus对应 vue-style-loader 和 stylus-loader
      styl: generateLoaders('stylus') // styl对应 vue-style-loader 和 styl-loader
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  var output = []
  var loaders = exports.cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}
