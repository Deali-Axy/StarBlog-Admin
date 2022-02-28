import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import NotFound from '@/views/404'
import Intro from "@/views/Intro/Intro"
import Categories from "@/views/Blog/Categories"
import Posts from "@/views/Blog/Posts"
import Photos from "@/views/Photography/Photos"

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
      name: 'Home',
      component: Home,
      children: [
        {
          path: '',
          name: '系统介绍',
          component: Intro,
          meta: {
            icon: 'fa fa-home fa-lg',
            index: 0
          }
        },
        {
          path: 'categories',
          name: '分类列表',
          component: Categories,
          meta: {
            icon: 'fa fa-list fa-lg',
            index: 1
          }
        },
        {
          path: 'posts',
          name: '文章列表',
          component: Posts,
          meta: {
            icon: 'fa fa-list fa-lg',
            index: 2
          }
        },
        {
          path: 'photos',
          name: '图片列表',
          component: Photos,
          meta: {
            icon: 'fa fa-picture-o fa-lg',
            index: 3
          }
        },
      ]
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
  ]
})


router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  let userName = localStorage.getItem('user')
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
