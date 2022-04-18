import axios from '../axios'

// 获取置顶博客
export const top = () => {
  return axios({
    url: 'Blog/Top',
    method: 'get'
  })
}

// 获取推荐博客
export const featured = () => {
  return axios({
    url: 'Blog/Featured',
    method: 'get'
  })
}

// 获取博客概况信息
export const overview = () => {
  return axios({
    url: 'Blog/Overview',
  })
}
