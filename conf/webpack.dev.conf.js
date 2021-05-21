/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  // target: process.env.NODE_ENV === 'development' ? 'web' : 'browserslist',
  target: 'web',
  devtool: 'eval-cheap-module-source-map',
  stats: {
    children: true,
  },
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    // hot: true,
    port: 8081,
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
});

// eslint-disable-next-line no-unused-vars
module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});
