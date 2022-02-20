import axios from '../axios'

// 获取博客列表
export const getList = (categoryId, page, pageSize) => {
  return axios({
    url: 'BlogPost',
    method: 'get',
    data: {categoryId, page, pageSize}
  })
}

// 获取指定博客文章
export const get = postId => {
  return axios({
    url: `BlogPost/${postId}/`,
    method: 'get',
  })
}
