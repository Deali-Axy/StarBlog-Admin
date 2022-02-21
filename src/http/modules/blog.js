import axios from '../axios'

// 获取博客列表
export const getList = (categoryId = 0, page = 1, pageSize = 20) => {
  return axios({
    url: 'BlogPost',
    method: 'get',
    params: {categoryId, page, pageSize}
  })
}

// 获取指定博客文章
export const get = postId => {
  return axios({
    url: `BlogPost/${postId}/`,
    method: 'get',
  })
}
