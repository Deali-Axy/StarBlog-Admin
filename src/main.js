// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import api from './http'
import Exceptionless from './utils/exceptionless'
import ErrorHandler from "./utils/errorHandler"
import global from './utils/global'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.min.css'

Vue.config.productionTip = false

// 引入Element
Vue.use(ElementUI)
// 引入API模块
Vue.use(api)
// Exceptionless模块
Vue.use(Exceptionless)
// 全局异步处理模块
Vue.use(ErrorHandler)

// 挂载全局配置模块
Vue.prototype.global = global

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
