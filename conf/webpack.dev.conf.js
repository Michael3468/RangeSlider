const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  target: 'web',
  devtool: 'eval-cheap-module-source-map',
  stats: {
    children: true,
  },
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist,
    port: 8081,
    public: 'localhost:8081',
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

module.exports = new Promise((resolve) => {
  resolve(devWebpackConfig);
});
