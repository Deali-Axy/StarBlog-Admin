import axios from "../axios"

// 获取全部
export const getAll = () => {
  return axios({
    url: 'FeaturedPhoto',
    method: 'get',
  })
}

// 获取指定项目
export const get = itemId => {
  return axios({
    url: `FeaturedPhoto/${itemId}`,
    method: 'get'
  })
}

// 添加项目
export const add = data => {
  return axios({
    url: 'FeaturedPhoto',
    method: 'post',
    data
  })
}

// 删除指定项目
export const deleteItem = itemId => {
  return axios({
    url: `FeaturedPhoto/${itemId}/`,
    method: 'delete'
  })
}
