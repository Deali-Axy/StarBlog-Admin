'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

/**
 * 开发环境配置
 * 从环境变量中读取敏感配置信息，避免硬编码到代码中
 */
module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: `"${process.env.BASE_URL || 'http://localhost:5038'}"`,
  EXCEPTION_LESS_API_KEY: `"${process.env.EXCEPTION_LESS_API_KEY || ''}"`,
  EXCEPTION_LESS_SERVER_URL: `"${process.env.EXCEPTION_LESS_SERVER_URL || 'http://localhost:5000'}"`,
})
