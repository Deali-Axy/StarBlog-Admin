import axios from '../axios'

/**
 * 获取博客列表
 * @param onlyPublished
 * @param status
 * @param categoryId
 * @param search
 * @param sortBy
 * @param page
 * @param pageSize
 * @returns {*}
 */
export const getList = (
  onlyPublished = false,
  status = '',
  categoryId = 0,
  search = '',
  sortBy = '',
  page = 1,
  pageSize = 20
) => {
  return axios({
    url: 'BlogPost',
    method: 'get',
    params: {onlyPublished, status, categoryId, search, sortBy, page, pageSize}
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

/**
 * 上传图片
 * @param itemId 文章ID
 * @param file 图片文件
 * @returns {*}
 */
export const uploadImage = (itemId, file) => {
  let formData = new FormData()
  formData.append('file', file)

  return axios({
    url: `BlogPost/${itemId}/UploadImage`,
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}

// 获取文章里的图片
export const getImages = itemId => {
  return axios({
    url: `BlogPost/${itemId}/Images`,
    method: 'get'
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
