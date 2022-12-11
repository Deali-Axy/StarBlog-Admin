import axios from '../axios'

export const getAll = () => {
  return axios({
    url: 'Link',
    method: 'get',
  })
}

export const get = itemId => {
  return axios({
    url: `Link/${itemId}/`,
    method: 'get',
  })
}

export const deleteItem = itemId => {
  return axios({
    url: `Link/${itemId}/`,
    method: 'delete'
  })
}

export const add = data => {
  return axios({
    url: `Link`,
    method: 'post',
    data
  })
}

export const update = data => {
  return axios({
    url: `Link/${data.id}/`,
    method: 'put',
    data
  })
}
