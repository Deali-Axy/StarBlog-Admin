import axios from '../axios'

export const getNeedAuditList = () => {
  return axios({
    url: 'Comment/GetNeedAuditList',
    method: 'get',
  })
}

export const get = itemId => {
  return axios({
    url: `Comment/${itemId}/`,
    method: 'get',
  })
}

export const accept = itemId => {
  return axios({
    url: `Comment/${itemId}/Accept`,
    method: 'post',
  })
}

export const reject = itemId => {
  return axios({
    url: `Comment/${itemId}/Reject`,
    method: 'post',
  })
}
