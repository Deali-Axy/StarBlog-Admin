import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/views/Login";
import Home from "@/views/Home";
import NotFound from '@/views/404'
import Intro from "@/views/Intro/Intro"
import Test from "@/views/Intro/Test"
import Posts from "@/views/Blog/Posts"

Vue.use(Router)

export default new Router({
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
          path: 'test',
          name: 'test',
          component: Test,
          meta: {
            icon: 'fa fa-home fa-lg',
            index: 1
          }
        },
        {
          path: 'posts',
          name: 'posts',
          component: Posts,
          meta: {
            icon: 'fa fa-home fa-lg',
            index: 1
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
