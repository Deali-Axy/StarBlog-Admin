import axios from "../axios"

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

export const get = categoryId => {
  return axios({
    url: `Category/${categoryId}`,
    method: 'get'
  })
}
