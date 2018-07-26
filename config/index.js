// see http://vuejs-templates.github.io/webpack for documentation.
// 引入nodejs的path对象: path.join([path1], [path2], […])合并路径等
var path = require('path');
module.exports = {
  build: {
    env: require('./prod.env'),
      // 编译输入的index.html文件
    index: path.resolve(__dirname, '../dist/index.html'),
      // webpack输出的目标文件夹路径
    assetsRoot: path.resolve(__dirname, '../dist'),
      // webpack编译输出的二级文件夹
    assetsSubDirectory: 'static',
      // webpack编译输出的发布路径
    assetsPublicPath: './',
      // 使用SourceMap
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
      // 默认不打开开启gzip模式
    productionGzip: false,
      // gzip模式下需要压缩的文件的扩展名
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
      // dev-server监听的端口
    port: 8080
      ,
      // 启动dev-server之后自动打开浏览器
    autoOpenBrowser: true,
      // webpack编译输出的二级文件夹
    assetsSubDirectory: 'static',
      // webpack编译输出的发布路径
    assetsPublicPath: '/',
      // 请求代理表，在这里可以配置特定的请求代理到对应的API接口
      // 例如将'/api/xxx'代理到'www.example.com/api/xxx'
    proxyTable: {
      '/b2b': {
        // target: 'http://klb2b.jinhui001.com/',
        // target: 'https://bshop.china-lin.com/',
        target:'https://bshop.staging.china-lin.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/b2b': '/'
        }
      },
      '/fsp': {
        // target: 'http://101.201.48.110/',
        // target: 'https://fsp.china-lin.com/',
        target: 'https://ifsp.staging.china-lin.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/fsp': '/'
        }

      },
      '/zl': {
          // target: 'https://wealth-home.rxhui.com/',
          target: 'https://wealth-staging.rxhui.com/',
          changeOrigin: true,
          pathRewrite: {
              '^/zl': '/'
          }
      },
        '/hczq': {
            // target: 'https://www.hczq.com/',
            target: 'http://hczq-staging.jinhui001.com/',
            changeOrigin: true,
            pathRewrite: {
                '^/hczq': '/'
            }
        }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
