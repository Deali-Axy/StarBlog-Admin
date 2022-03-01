import axios from '../axios'

// 获取列表
export const getList = (page = 1, pageSize = 10) => {
  return axios({
    url: 'Photo',
    method: 'get',
    params: {page, pageSize}
  })
}

// 获取指定项目
export const get = photoId => {
  return axios({
    url: `Photo/${photoId}/`,
    method: 'get',
  })
}

// 上传图片
export const add = (title, location, file) => {
  let formData = new FormData()
  formData.append('title', title)
  formData.append('location', location)
  formData.append('file', file)

  return axios({
    url: 'Photo',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}

// 删除指定项目
export const deleteItem = itemId => {
  return axios({
    url: `Photo/${itemId}/`,
    method: 'delete'
  })
}

// 设置推荐
export const setFeatured = itemId => {
  return axios({
    url: `Photo/${itemId}/SetFeatured`,
    method: 'post'
  })
}

// 取消推荐
export const cancelFeatured = itemId => {
  return axios({
    url: `Photo/${itemId}/CancelFeatured`,
    method: 'post'
  })
}
