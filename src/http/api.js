// 接口统一集成模块
import * as auth from './modules/auth'
import * as blog from './modules/blog'
import * as blogPost from './modules/blogPost'
import * as category from './modules/category'
import * as photo from './modules/photo'
import * as user from './modules/user'

// 默认全部导出
export default {auth, blog, blogPost, category, photo, user}
