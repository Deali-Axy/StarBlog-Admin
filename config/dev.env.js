'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://localhost:5038"',
  EXCEPTION_LESS_API_KEY: '"1suhJwX6x14Ao1UtfK5vhoKfzwun47KvJDvsKCzv"',
  EXCEPTION_LESS_SERVER_URL: '"http://10.116.163.185:5000"',
})
