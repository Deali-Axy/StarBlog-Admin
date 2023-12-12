import axios from '../axios'

export const getList = (
  postId = null,
  search = '',
  sortBy = '',
  page = 1,
  pageSize = 20
) => {
  return axios({
    url: 'Comment',
    method: 'get',
    params: {postId, search, sortBy, page, pageSize}
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
