import axios from '../axios'


// 登录
export const login = data => {
  return axios({
    url: 'Auth',
    method: 'post',
    data
  })
}

// 获取用户信息
export const get = () => axios({
  url: 'Auth',
  method: 'get'
})
