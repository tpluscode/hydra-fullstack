const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const webpack = require('webpack')

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './src/index.html'),
  }),
  {
    plugins: [
      new webpack.EnvironmentPlugin(['API_ROOT']),
    ],
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    node: {
      crypto: true,
    },
  },
)
