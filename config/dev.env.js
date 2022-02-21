'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  ENV_FLAG: '"dev"',
  BASE_URL: '"/back/dcErp/faw"',
  BILL_URL: '"http://10.8.0.1/track/bill-of-lading"'
})
