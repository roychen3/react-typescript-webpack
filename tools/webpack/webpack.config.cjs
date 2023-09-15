const path = require('path')

const { isDev, getRootPath } = require('./webpack.helpers')
const { getOutput } = require('./webpack.output')
const { getRules } = require('./webpack.rules')
const { getPlugins } = require('./webpack.plugins')
const { getOptimization } = require('./webpack.optimization')

const rootPath = getRootPath()
const devMode = isDev()

module.exports = {
  mode: devMode ? 'development' : 'production',
  entry: path.resolve(rootPath, 'src/main.tsx'),
  devtool: devMode ? 'inline-source-map' : 'source-map',
  output: getOutput(),
  module: {
    rules: getRules()
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(rootPath)
    }
  },
  plugins: getPlugins(),
  devServer: devMode
    ? {
        port: 3000,
        allowedHosts: 'all',
        historyApiFallback: true,
        compress: true
      }
    : undefined,
  optimization: devMode ? undefined : getOptimization()
}
