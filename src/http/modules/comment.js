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

export const accept = (itemId, reason) => {
  return axios({
    url: `Comment/${itemId}/Accept`,
    method: 'post',
    data: {
      reason
    }
  })
}

export const reject = (itemId, reason) => {
  return axios({
    url: `Comment/${itemId}/Reject`,
    method: 'post',
    data: {
      reason
    }
  })
}
