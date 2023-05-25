import axios from '../axios'

// 获取置顶博客
export const top = () => {
  return axios({
    url: 'Blog/Top',
    method: 'get'
  })
}

// 获取推荐博客
export const featured = () => {
  return axios({
    url: 'Blog/Featured',
    method: 'get'
  })
}

// 获取博客概况信息
export const overview = () => {
  return axios({
    url: 'Blog/Overview',
  })
}

// 博客文章状态列表
export const getStatusList = () => {
  return axios({
    url: 'Blog/GetStatusList'
  })
}

// 文章上传
export const upload = (title, summary, categoryId, file, zipEncoding = 'utf-8') => {
  let formData = new FormData()
  formData.append('title', title)
  formData.append('summary', summary)
  formData.append('categoryId', categoryId)
  formData.append('file', file)
  formData.append('zipEncoding', zipEncoding)

  return axios({
    url: 'Blog/Upload',
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data;charset=UTF-8'},
    data: formData
  })
}
