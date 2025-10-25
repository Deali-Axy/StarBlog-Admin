'use strict'

/**
 * 生产环境配置
 * 从环境变量中读取敏感配置信息，避免硬编码到代码中
 */
module.exports = {
  NODE_ENV: '"production"',
  BASE_URL: `"${process.env.BASE_URL || ''}"`,
  EXCEPTION_LESS_API_KEY: `"${process.env.EXCEPTION_LESS_API_KEY || ''}"`,
  EXCEPTION_LESS_SERVER_URL: `"${process.env.EXCEPTION_LESS_SERVER_URL || ''}"`
}
