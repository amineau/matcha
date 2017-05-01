module.exports = {
  // This is the "main" file which should include all other modules
  entry: './public/js/main.js',
  // Where should the compiled file go?
  output: {
    path: __dirname + '/dist',
    publicPath: 'dist/',
    filename: 'build.js'
  },
  module: {
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
  // vue: {
  //   loaders: {
  //     js: 'babel-loader'
  //   }
  // },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  }
}
