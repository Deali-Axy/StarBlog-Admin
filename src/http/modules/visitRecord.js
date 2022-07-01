import axios from '../axios'

// 获取列表
export const getList = (page = 1, pageSize = 10) => {
  return axios({
    url: 'VisitRecord',
    method: 'get',
    params: {page, pageSize}
  })
}

// 获取指定项目
export const get = photoId => {
  return axios({
    url: `VisitRecord/${photoId}/`,
    method: 'get',
  })
}

// 获取全部项目
export const getAll = () => {
  return axios({url: 'VisitRecord/All'})
}

// 获取概览数据
export const getOverview = () => {
  return axios({url: 'VisitRecord/Overview'})
}

// 获取趋势数据
export const getTrend = (days = 7) => {
  return axios({
    url: 'VisitRecord/Trend',
    method: 'get',
    params: {days}
  })
}

// 获取统计数据
export const getStats = (date = null) => {
  return axios({
    url: 'VisitRecord/Stats',
    method: 'get',
    params: date === null ? null : {...date}
  })
}
