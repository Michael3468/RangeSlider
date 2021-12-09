/* eslint-disable dot-notation */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

const isProd = process.env.NODE_ENV === 'production';

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  site_pages: path.join(__dirname, '../src/components/site-pages'),
  assets: 'assets/',
};

// Pages const for HtmlWebpackPlugin
const PAGES_DIR = `${PATHS.src}/pages`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter((filename) => filename.endsWith('.pug'));

module.exports = {
  externals: {
    paths: PATHS,
  },
  entry: {
    'range-slider': `${PATHS.src}/app.ts`,
  },
  output: {
    filename: isProd ? `${PATHS.assets}js/[name].min.js` : `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'range-slider-vendors',
          test: /node_modules/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          outputPath: 'assets/fonts',
          publicPath: '../fonts',
          name: '[name].[ext]',
          limit: 1000,
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { sourceMap: true },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: { path: './postcss.config.js' },
            },
          },
          {
            loader: 'sass-loader',
            options: { sourceMap: true },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '~': 'src',
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      jQuery: 'jquery',
      'window.jquery': 'jquery',
      'window.jQuery': 'jquery',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? `${PATHS.assets}css/[name].min.css` : `${PATHS.assets}css/[name].[hash].css`,
    }),
  ],
};

if (process.env['NODE_ENV'] !== 'production') {
  module.exports.plugins.push(
    ...PAGES.map(
      (page) => new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`, // .pug
        filename: `./${page.replace(/\.pug/, '.html')}`, // .html
        chunks: ['range-slider', 'range-slider-vendors', path.parse(page).name],
      }),
    ),
  );
}
