const path = require('path')
const merge = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')

module.exports = merge(
  createDefaultConfig({
    input: path.resolve(__dirname, './src/index.html'),
  }),
  {
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    node: {
      crypto: true,
    },
  },
)
