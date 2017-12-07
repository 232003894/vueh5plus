var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ],
      }, {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['*', '.js', '.vue', '.json']
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}


// var package = require('./package.json');
// var banner = ` ${package.name} v${package.version}\n ${package.description}\n author: ${package.author}\n repository: ${package.repository.url}\n @license MIT`

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: true,
      beautify: false,
      // https://github.com/mishoo/UglifyJS2/blob/master/lib/output.js
      output: {
        //中文ascii化，非常有用！防止中文乱码的神配置
        ascii_only: true,
        //在输出中保存版权注释
        comments: false
      },
      // https://github.com/mishoo/UglifyJS2/blob/master/lib/compress.js
      compress: {
        // 不输出警告
        warnings: false,
        // 去掉 console
        drop_console: true,
        // 去掉 debugger
        drop_debugger: true
      },
      sourceMap: false
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
// if (process.env.NODE_ENV === 'production') {
//   module.exports.entry = './src/lib/index.js'
//   module.exports.output.path = path.resolve(__dirname, './')
//   module.exports.output.filename = 'vue-h5plus.min.js'
//   module.exports.devtool = ''
//   // http://vue-loader.vuejs.org/en/workflow/production.html
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       mangle: true,
//       beautify: false,
//       // https://github.com/mishoo/UglifyJS2/blob/master/lib/output.js
//       output: {
//         //中文ascii化，非常有用！防止中文乱码的神配置
//         ascii_only: true,
//         //在输出中保存版权注释
//         comments: false
//       },
//       // https://github.com/mishoo/UglifyJS2/blob/master/lib/compress.js
//       compress: {
//         // 不输出警告
//         warnings: false,
//         // 去掉 console
//         drop_console: true,
//         // 去掉 debugger
//         drop_debugger: true
//       },
//       sourceMap: false
//     }),
//     new webpack.BannerPlugin(banner),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }
