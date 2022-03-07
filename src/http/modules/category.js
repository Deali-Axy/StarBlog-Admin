import axios from "../axios"

// 获取全部分类
export const getAll = () => {
  return axios({
    url: 'Category/All',
    method: 'get',
  })
}

export const getList = (page = 1, pageSize = 10) => {
  return axios({
    url: 'Category',
    method: 'get',
    params: {page, pageSize}
  })
}

// 获取指定项目
export const get = itemId => {
  return axios({
    url: `Category/${itemId}`,
    method: 'get'
  })
}

// 分类词云
export const wordCloud = () => {
  return axios({
    url: 'Category/WordCloud'
  })
}

// 设置推荐分类
export const setFeatured = (itemId, data) => {
  return axios({
    url: `Category/${itemId}/SetFeatured`,
    method: 'post',
    data
  })
}

// 取消推荐分类
export const cancelFeatured = itemId => {
  return axios({
    url: `Category/${itemId}/CancelFeatured`,
    method: 'post'
  })
}

// 设置为可见
export const setVisible = itemId => {
  return axios({
    url: `Category/${itemId}/SetVisible`,
    method: 'post',
  })
}

// 设置为不可见
export const setInvisible = itemId => {
  return axios({
    url: `Category/${itemId}/SetInvisible`,
    method: 'post',
  })
}
