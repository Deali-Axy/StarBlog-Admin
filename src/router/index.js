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
import Photos from "@/views/Photography/Photos"
import FeaturedPhotos from "@/views/Photography/FeaturedPhotos"
import Cookies from "js-cookie";

const originalPush = Router.prototype.push

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

const router = new Router({
  mode: 'history',
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
        {path: 'photo/list', name: '图片列表', component: Photos},
        {path: 'photo/featured', name: '推荐图片', component: FeaturedPhotos},
      ]
    },
    {path: '/Login', name: 'Login', component: Login},
    {path: '/404', name: 'NotFound', component: NotFound},
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  let userName = localStorage.getItem('user')
  let expiration = localStorage.getItem('expiration')

  // token过期判断
  if (expiration) {
    let now = new Date()
    let expirationTime = new Date(expiration)
    if (now > expirationTime) {
      console.log('token已经过期，跳转重新登录')
      localStorage.removeItem('user')
      localStorage.removeItem('expiration')
      Cookies.set('token', null)
      router.push('/login')
    }
  }

  if (to.path === '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (userName) next({path: '/'})
    else next()
  } else {
    if (!userName) {
      // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
      next({path: '/login'})
    }
    next()
  }
})

export default router
