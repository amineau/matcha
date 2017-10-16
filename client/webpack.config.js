var path = require('path')
var webpack = require('webpack')


module.exports = {
    entry: [
      './src/src/main.js'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: "build.js"    
    },
    module: {
      loaders: [
        {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query:{
          presets: ["env"]
        }
        },
        {
          test: /\.scss$/,
          loaders: ["css-loader", "sass-loader"]
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: {
                scss: ["vue-style-loader", "css-loader", "sass-loader"],
                js: "babel-loader"
            }
          }
        }
      ]
    },
    node: {
      net: 'empty',
      tls: 'empty',
      dns: 'empty',
      fs: 'empty'
    },

    resolve: {
      alias: {
        vue: 'vue/dist/vue.js',
        'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js')
      }
    },
    stats: {colors: true},
    devtool: "cheap-module-source-map",
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jquery: 'jquery',
        'window.jQuery': 'jquery',
        jQuery: 'jquery'
      }),
      new WEBPACK.DefinePlugin({
        'process.env': {
          'api': `http://${process.env.ipHost}:14242/`
        }
      })
    ]
}
