import axios from '../axios'

// 获取列表
export const getList = (
  {
    excludeApi = false,
    excludeIntranetIp = false,
    country = '',
    province = '',
    city = '',
    isp = '',
    os = '',
    device = '',
    userAgent = '',
    isSpider = null,
    search = '',
    sortBy = '',
    page = 1,
    pageSize = 10,
  }) => {
  return axios({
    url: 'VisitRecord',
    method: 'get',
    params: {
      excludeApi, excludeIntranetIp,
      country, province, city, isp,
      os, device, userAgent, isSpider,
      search, sortBy, page, pageSize
    }
  })
}

// 获取指定项目
export const get = id => {
  return axios({
    url: `VisitRecord/${id}/`,
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
    url: 'VisitRecord/DailyTrend',
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

export const getGeoFilterParams = (
  {
    param = 'country',
    country = '',
    province = '',
    city = '',
  }) => {
  return axios({
    url: 'VisitRecord/GeoFilterParams',
    params: {param, country, province, city},
  })
}

export const getUserAgentFilterParams = () => {
  return axios({
    url: 'VisitRecord/UserAgentFilterParams',
  })
}
