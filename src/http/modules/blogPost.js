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
export const get = itemId => {
  return axios({
    url: `BlogPost/${itemId}/`,
    method: 'get',
  })
}

// 删除指定博客
export const deleteItem = itemId => {
  return axios({
    url: `BlogPost/${itemId}/`,
    method: 'delete'
  })
}

// 添加博客
export const add = data => {
  return axios({
    url: `BlogPost`,
    method: 'post',
    data
  })
}

// 更新博客文章
export const update = data => {
  return axios({
    url: `BlogPost/${data.id}/`,
    method: 'put',
    data
  })
}

// 设置推荐博客
export const setFeatured = itemId => {
  return axios({
    url: `BlogPost/${itemId}/SetFeatured`,
    method: 'post'
  })
}

// 取消推荐博客
export const cancelFeatured = itemId => {
  return axios({
    url: `BlogPost/${itemId}/CancelFeatured`,
    method: 'post'
  })
}

// 设置置顶
export const setTop = itemId => {
  return axios({
    url: `BlogPost/${itemId}/SetTop`,
    method: 'post'
  })
}
