const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const { isDev } = require('./webpack.helpers')

const devMode = isDev()

function getStyleLoader() {
  return devMode ? 'style-loader' : MiniCssExtractPlugin.loader
}

function getPostcssLoader() {
  return {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'postcss-preset-env',
            {
              // Options
            }
          ]
        ]
      }
    }
  }
}

function getRules() {
  return [
    {
      test: /\.(sa|sc|c)ss$/i,
      exclude: /\.module\.(sa|sc|c)ss$/i,
      use: [getStyleLoader(), 'css-loader', getPostcssLoader(), 'sass-loader']
    },
    {
      test: /\.module\.(sa|sc|c)ss$/i,
      use: [
        getStyleLoader(),
        {
          loader: 'css-loader',
          options: {
            modules: true
          }
        },
        getPostcssLoader(),
        'sass-loader'
      ]
    },
    {
      test: /\.(t|j)sx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'ts-loader',
        options: {
          transpileOnly: true // need this option for typescript config `noEmit`
        }
      }
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource'
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource'
    }
  ]
}

module.exports = {
  getRules
}
