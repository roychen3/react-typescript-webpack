const path = require('path');

const { isDev, getRootPath } = require('./webpack.helpers');

const rootPath = getRootPath();

function getOutput() {
  const devMode = isDev();
  if (devMode) {
    return {
      filename: 'main.js',
      path: path.resolve(rootPath, 'dist'),
      clean: true,
    };
  }
  return {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    clean: true,
  };
}

module.exports = {
  getOutput,
};
