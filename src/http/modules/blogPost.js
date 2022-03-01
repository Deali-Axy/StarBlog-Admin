import axios from '../axios'

// 获取博客列表
export const getList = (categoryId = 0, page = 1, pageSize = 20) => {
  return axios({
    url: 'BlogPost',
    method: 'get',
    params: {categoryId, page, pageSize}
  })
}

// 获取指定博客文章
export const get = postId => {
  return axios({
    url: `BlogPost/${postId}/`,
    method: 'get',
  })
}

// 删除指定博客
export const deletePost = postId => {
  return axios({
    url: `BlogPost/${postId}/`,
    method: 'delete'
  })
}

// 设置推荐博客
export const setFeatured = postId => {
  return axios({
    url: `BlogPost/${postId}/SetFeatured`,
    method: 'post'
  })
}

// 取消推荐博客
export const cancelFeatured = postId => {
  return axios({
    url: `BlogPost/${postId}/CancelFeatured`,
    method: 'post'
  })
}

// 设置置顶
export const setTop = postId => {
  return axios({
    url: `BlogPost/${postId}/SetTop`,
    method: 'post'
  })
}
