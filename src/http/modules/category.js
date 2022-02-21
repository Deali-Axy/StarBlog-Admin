import axios from "../axios"

// 获取博客分类列表
export const getList = () => {
  return axios({
    url: 'Category',
    method: 'get'
  })
}

export const get = categoryId => {
  return axios({
    url: `Category/${categoryId}`,
    method: 'get'
  })
}
