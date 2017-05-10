var path = require('path')
var webpack = require('webpack')

module.exports = {
  // This is the "main" file which should include all other modules
  entry: [
    './src/main.js'
  ],
  // Where should the compiled file go?
  output: {
    path: __dirname + '/dist',
    filename: 'build.js'
  },
  module: {
    unknownContextCritical: false,
    exprContextCritical: false,
    // Special compilation rules
    loaders: [
      {
       test: /\.js$/,
       loader: 'babel-loader',
       exclude: /node_modules/
      },
      {
       test: /\.vue$/,
       loader: 'vue-loader'
      }
    ]
  },
  node: {
    net: 'empty',
    tls: 'empty',
    dns: 'empty',
    fs: 'empty'
  },
  // vue: {
  //   loaders: {
  //     js: 'babel-loader'
  //   }
  // },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
      'jquery': path.resolve(__dirname, '../node_modules/jquery/dist/jquery.js')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery'
    })
  ]
}
