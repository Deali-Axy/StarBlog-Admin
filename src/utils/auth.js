import Cookies from "js-cookie";

/**
 * 检查是否已登录
 * @return boolean
 */
export const isLogin = () => {
  let token = Cookies.get('token')
  let userName = localStorage.getItem('user')

  if (!token || token.length === 0) return false
  if (!userName || userName.length === 0) return false
  return !isExpired();
}

/**
 * 检查登录是否过期
 * @return boolean
 */
export const isExpired = () => {
  let expiration = localStorage.getItem('expiration')
  if (expiration) {
    let now = new Date()
    let expirationTime = new Date(expiration)
    if (now > expirationTime) return true
  }

  return false
}

/**
 * 读取保存的token
 * @return string
 */
export const getToken = () => {
  return Cookies.get('token')
}

/**
 * 保存登录信息
 * @param token 密钥
 * @param username 用户名
 * @param expiration token过期时间
 */
export const login = (token, username, expiration) => {
  // 保存token到Cookie
  Cookies.set('token', token)
  // 保存登录数据到本地会话
  localStorage.setItem('user', username)
  localStorage.setItem('expiration', expiration)
}

// 注销
export const logout = () => {
  Cookies.set('token', null)
  localStorage.removeItem('user')
  localStorage.removeItem('expiration')
}

