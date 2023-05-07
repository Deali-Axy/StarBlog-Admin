import axios from '../axios'

export const getAll = () => {
  return axios({
    url: 'LinkExchange',
    method: 'get',
  })
}

export const get = itemId => {
  return axios({
    url: `LinkExchange/${itemId}/`,
    method: 'get',
  })
}

export const deleteItem = itemId => {
  return axios({
    url: `LinkExchange/${itemId}/`,
    method: 'delete'
  })
}

export const add = data => {
  return axios({
    url: `LinkExchange`,
    method: 'post',
    data
  })
}

export const update = data => {
  return axios({
    url: `LinkExchange/${data.id}/`,
    method: 'put',
    data
  })
}


export const accept = (itemId, reason = null) => {
  return axios({
    url: `LinkExchange/${itemId}/Accept`,
    method: 'post',
    data: {
      reason
    },
  })
}

export const reject = (itemId, reason = null) => {
  return axios({
    url: `LinkExchange/${itemId}/Reject`,
    method: 'post',
    data: {
      reason
    },
  })
}
