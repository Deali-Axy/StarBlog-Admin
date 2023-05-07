import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/views/Login";
import Framework from "@/views/Framework";
import NotFound from '@/views/404'
import Home from "@/views/Home"
import Categories from "@/views/Category/Categories"
import FeaturedCategories from "@/views/Category/FeaturedCategories"
import Posts from "@/views/Blog/Posts"
import TopPost from "@/views/Blog/TopPost"
import FeaturedPosts from "@/views/Blog/FeaturedPosts"
import EditPost from "@/views/Blog/EditPost";
import UploadPost from "@/views/Blog/UploadPost";
import Photos from "@/views/Photography/Photos"
import FeaturedPhotos from "@/views/Photography/FeaturedPhotos"
import VisitRecordList from "@/views/VisitRecord/List"
import ConfigList from "@/views/Config/List"
import LinkList from '@/views/Link/List'
import LinkExchangeList from '@/views/LinkExchange/List.vue'
import * as auth from '@/utils/auth'


const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/',
      component: Framework,
      children: [
        {
          path: '',
          name: '系统主页',
          component: Home,
          meta: {
            icon: 'fa fa-home fa-lg',
            index: 0
          }
        },
        {path: 'category/list', name: '分类列表', component: Categories},
        {path: 'category/featured', name: '推荐分类', component: FeaturedCategories},
        {path: 'post/list', name: '文章列表', component: Posts},
        {path: 'post/featured', name: '推荐文章', component: FeaturedPosts},
        {path: 'post/top', name: '置顶文章', component: TopPost},
        {path: 'post/edit/:id', name: '编辑文章', component: EditPost},
        {path: 'post/new', name: '新增文章', component: EditPost},
        {path: 'post/upload', name: '上传文章', component: UploadPost},
        {path: 'photo/list', name: '图片列表', component: Photos},
        {path: 'photo/featured', name: '推荐图片', component: FeaturedPhotos},
        {path: 'visit_record/list', name: '访问记录', component: VisitRecordList},
        {path: 'config/list', name: '配置中心', component: ConfigList},
        {path: 'link/list', name: '友情链接管理', component: LinkList},
        {path: 'link_exchange/list', name: '友链申请', component: LinkExchangeList},
      ]
    },
    {path: '/Login', name: 'Login', component: Login},
    {path: '/404', name: 'NotFound', component: NotFound},
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (auth.isExpired()) {
    auth.logout()
    router.push('/login')
  }

  if (to.path === '/login') {
    // 访问登录界面，如果已登录，跳转到主页
    if (auth.isLogin()) next({path: '/'})
    else next()
  } else {
    if (!auth.isLogin()) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({path: '/login'})
    }
    next()
  }
})

export default router
