import axios from 'axios';
import config from './config';
import Cookies from "js-cookie";
import router from '@/router'
import * as auth from '@/utils/auth'

export default function $axios(options) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: config.baseUrl,
      headers: config.headers,
      timeout: config.timeout,
      withCredentials: config.withCredentials
    })
    // request 请求拦截器
    instance.interceptors.request.use(
      config => {
        if (!auth.isLogin()) {
          // 重定向到登录页面
          router.push('/login')
        }

        // 发送请求时携带token
        let token = auth.getToken()
        config.headers.Authorization = `Bearer ${token}`

        return config
      },
      error => {
        // 请求发生错误时
        console.log('request:', error)
        // 判断请求超时
        if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
          console.log('timeout请求超时')
        }
        // 需要重定向到错误页面
        const errorInfo = error.response
        console.log(errorInfo)
        if (errorInfo) {
          error = errorInfo.data  // 页面那边catch的时候就能拿到详细的错误信息,看最下边的Promise.reject
          const errorStatus = errorInfo.status; // 404 403 500 ...
          router.push({
            path: `/error/${errorStatus}`
          })
        }
        return Promise.reject(error) // 在调用的那边可以拿到(catch)你想返回的错误信息
      }
    )

    // response 响应拦截器
    instance.interceptors.response.use(
      response => {
        return response.data
      },
      err => {
        let reason = err
        if (err && err.response) {
          // 包装一下默认的错误提示
          switch (err.response.status) {
            case 400:
              err.message = '请求参数错误'
              break
            case 401:
              err.message = '请先登录再访问'
              break
            case 403:
              err.message = '拒绝访问，没有访问权限'
              break
            case 404:
              err.message = `请求地址出错: ${err.response.config.url}`
              break
            case 408:
              err.message = '请求超时'
              break
            case 500:
              err.message = '服务器内部错误'
              break
            case 501:
              err.message = '服务未实现'
              break
            case 502:
              err.message = '网关错误'
              break
            case 503:
              err.message = '服务不可用'
              break
            case 504:
              err.message = '网关超时'
              break
            case 505:
              err.message = 'HTTP版本不受支持'
              break
            default:
          }

          // 如果有错误响应的话就处理
          if (err.response.data) {
            reason = err.response.data
            // 如果没有返回错误信息的话就用上面的默认信息
            if (!reason.message) reason.message = err.message
          }
        }
        console.error(err)
        return Promise.reject(reason) // 返回接口返回的错误信息
      }
    )
    // 请求处理
    instance(options).then(res => {
      resolve(res)
      return false
    }).catch(error => {
      reject(error)
    })
  })
}
