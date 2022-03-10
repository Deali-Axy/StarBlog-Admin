export default {
  state: {
    appName: "StarBlog",  // 应用名称
    themeColor: "#14889A",  // 主题颜色
    oldThemeColor: "#14889A",   // 上一次主题颜色
    collapse: false,  // 导航栏收缩状态
    menuRouteLoaded: false,    // 菜单和路由是否已经加载
    fullscreen: false,      // 全屏状态
  },
  getters: {
    collapse(state) {   // 对应着上面state
      return state.collapse
    },
    fullscreen(state) {
      return state.fullscreen
    }
  },
  mutations: {
    // 改变收缩状态
    onCollapse(state) {
      state.collapse = !state.collapse
    },
    // 改变主题颜色
    setThemeColor(state, themeColor) {
      state.oldThemeColor = state.themeColor
      state.themeColor = themeColor
    },
    // 改变菜单和路由的加载状态
    menuRouteLoaded(state, menuRouteLoaded) {
      state.menuRouteLoaded = menuRouteLoaded;
    },
    // 切换全屏
    onFullscreenChange(state) {
      state.fullscreen = !state.fullscreen
    }
  },
  actions: {}
}
