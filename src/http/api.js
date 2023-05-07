// 接口统一集成模块
import * as auth from './modules/auth'
import * as blog from './modules/blog'
import * as blogPost from './modules/blogPost'
import * as category from './modules/category'
import * as config from './modules/config'
import * as featuredCategory from './modules/featuredCategory'
import * as featuredPhoto from './modules/featuredPhoto'
import * as featuredPost from './modules/featuredPost'
import * as link from './modules/link'
import * as linkExchange from './modules/linkExchange'
import * as photo from './modules/photo'
import * as visitRecord from './modules/visitRecord'

// 默认全部导出
export default {
  auth,
  blog,
  blogPost,
  category,
  config,
  featuredCategory,
  featuredPhoto,
  featuredPost,
  link,
  linkExchange,
  photo,
  visitRecord,
}
