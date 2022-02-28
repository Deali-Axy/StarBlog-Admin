import axios from '../axios'


// 登录
export const login = data => {
  return axios({
    url: 'Auth',
    method: 'post',
    data
  })
}
