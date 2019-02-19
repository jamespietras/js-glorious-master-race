const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const config = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {sourceMap: true},
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({browsers: ['> 0.1%']}),
              ],
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {sourceMap: true},
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {sourceMap: true},
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer({browsers: ['> 0.1%']}),
              ],
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.jpg$/,
        loader: 'url-loader',
        options: { 
            limit: 8000,
            name: 'images/[hash]-[name].[ext]',
        },
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
  ],
  stats: 'minimal',
};

module.exports = config;
