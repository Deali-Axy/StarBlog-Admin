import axios from "../axios"

// 获取全部
export const getAll = () => {
  return axios({
    url: 'FeaturedPost',
    method: 'get',
  })
}

// 获取指定项目
export const get = itemId => {
  return axios({
    url: `FeaturedPost/${itemId}`,
    method: 'get'
  })
}

// 添加项目
export const add = data => {
  return axios({
    url: 'FeaturedPost',
    method: 'post',
    data
  })
}

// 删除指定项目
export const deleteItem = itemId => {
  return axios({
    url: `FeaturedPost/${itemId}/`,
    method: 'delete'
  })
}
