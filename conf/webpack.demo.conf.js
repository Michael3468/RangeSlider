const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  plugins: [],
});

module.exports = new Promise((resolve) => {
  resolve(buildWebpackConfig);
});
