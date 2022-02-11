'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_FLAG: '"hotfix"',
  BASE_URL: '"/back/dcErpHotfix/faw"',
})
