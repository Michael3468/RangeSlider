/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable key-spacing */
/* eslint-disable quote-props */
const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
// const isProd = process.env.NODE_ENV === 'production',
// const isDev = !isProd,

const PATHS = {
  src: path.join(__dirname, '../src'),
  dist: path.join(__dirname, '../dist'),
  site_pages: path.join(__dirname, '../src/components/site-pages'),
  ui_kit: path.join(__dirname, '../src/components/ui-kit'),
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
    'app': `${PATHS.src}/app.ts`,
    'index' : `${PATHS.site_pages}/index/index.ts`,
  },
  output: {
    filename: `${PATHS.assets}js/[name].[hash].js`,
    path: PATHS.dist,
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendors',
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
        test: /\.scss$/,
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
    extensions: ['.tsx', '.ts', '.js'],
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
      filename: `${PATHS.assets}css/[name].[hash].css`,
    }),
    new CopyWebpackPlugin([
      {
        from: `${PATHS.src}/components/**/*.{jpg,jpeg,png,svg,gif}`,
        to: `${PATHS.assets}img`,
        flatten: true,
      },
      { from: `${PATHS.src}/static`, to: '' },
    ]),

    ...PAGES.map(
      (page) => new HtmlWebpackPlugin({
        template: `${PAGES_DIR}/${page}`, // .pug
        filename: `./${page.replace(/\.pug/, '.html')}`, // .html
        chunks: ['app', 'vendors', path.parse(page).name],
      }),
    ),
  ],
};
