const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');

const { isDev } = require('./webpack.helpers');

function getExposeEnv() {
  const result = dotenv.config(); // reade `/.env` file
  let exposeEnv = {
    NODE_ENV: process.env.NODE_ENV,
  };

  if (result.parsed) {
    Object.entries(result.parsed)
      .filter(([key]) => /^APP_ENV_/.test(key))
      .forEach(([key, value]) => {
        exposeEnv[key] = value;
      });
  }
  return exposeEnv;
}

function getPlugins() {
  const devMode = isDev();

  const plugins = [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      favicon: 'public/vite.svg',
      filename: 'index.html',
      inject: 'head',
      cache: false,
    }),
    !devMode && new MiniCssExtractPlugin(),
    new ForkTsCheckerWebpackPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(getExposeEnv()),
    }),
  ].filter(Boolean);
  return plugins;
}

module.exports = { getPlugins };
