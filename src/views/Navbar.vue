<template>
  <div class="menu-bar-container">
    <!-- logo -->
    <div class="logo"
         :style="{'background':themeColor, 'display': fullscreen? 'none':''}"
         :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
         @click="$router.push('/')">
      <img v-if="collapse" src="@/assets/codelab.jpg"/>
      <div>{{ collapse ? '' : appName }}</div>
    </div>
    <!-- 导航菜单 -->
    <el-menu ref="navMenu"
             :style="{'display': fullscreen? 'none':''}"
             :default-active="$route.path"
             :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
             :collapse="collapse"
             :collapse-transition="false"
             :unique-opened="false"
             router
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">主页</span>
      </el-menu-item>
      <el-submenu index="blog">
        <template slot="title">
          <i class="el-icon-s-grid"></i>
          <span>博客</span>
        </template>
        <el-menu-item-group title="分类管理">
          <el-menu-item index="/category/list">分类列表</el-menu-item>
          <el-menu-item index="/category/featured">推荐分类</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="文章管理">
          <el-menu-item index="/post/list">文章列表</el-menu-item>
          <el-menu-item index="/post/featured">推荐文章</el-menu-item>
          <el-menu-item index="/post/top">置顶文章</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="黑科技">
          <el-menu-item index="/post/upload">打包上传</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="photography">
        <template slot="title">
          <i class="el-icon-camera"></i>
          <span>摄影</span>
        </template>
        <el-menu-item-group title="照片管理">
          <el-menu-item index="/photo/list">照片列表</el-menu-item>
          <el-menu-item index="/photo/featured">推荐图片</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="/visit_record/list">
        <i class="el-icon-menu"></i>
        <span slot="title">访问日志</span>
      </el-menu-item>
      <el-menu-item index="/config/list">
        <i class="el-icon-s-tools"></i>
        <span slot="title">配置中心</span>
      </el-menu-item>
      <el-submenu index="link">
        <template slot="title">
          <i class="el-icon-link"></i>
          <span>友情链接</span>
        </template>
        <el-menu-item-group title="友情链接管理">
          <el-menu-item index="/link/list">友情链接</el-menu-item>
          <el-menu-item index="/link_exchange/list">友链申请管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: {
    ...mapState({
      appName: state => state.app.appName,
      themeColor: state => state.app.themeColor,
      collapse: state => state.app.collapse,
      fullscreen: state => state.app.fullscreen,
    }),
    mainTabs: {
      get() {
        return this.$store.state.tab.mainTabs
      },
      set(val) {
        this.$store.commit('updateMainTabs', val)
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.tab.mainTabsActiveName
      },
      set(val) {
        this.$store.commit('updateMainTabsActiveName', val)
      }
    }
  },
  watch: {
    $route: 'handleRoute'
  },
  created() {
    this.handleRoute(this.$route)
  },
  methods: {
    // 路由操作处理
    handleRoute(route) {
      // tab标签页选中, 如果不存在则先添加
      let tab = this.mainTabs.filter(item => item.name === route.name)[0]
      if (!tab) {
        tab = {
          name: route.name,
          title: route.name,
          icon: route.meta.icon,
          fullPath: route.fullPath,
          path: route.path,
          params: route.params,
          query: route.query
        }
        this.mainTabs = this.mainTabs.concat(tab)
      }
      this.mainTabsActiveName = tab.name
      // 切换标签页时同步更新高亮菜单
      if (this.$refs.navMenu != null) {
        this.$refs.navMenu.activeIndex = '' + route.meta.index
        this.$refs.navMenu.initOpenedMenu()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-bar-container {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1020;

  .el-menu {
    position: absolute;
    top: 60px;
    bottom: 0;
    text-align: left;
  }

  .logo {
    position: absolute;
    top: 0;
    height: 60px;
    line-height: 60px;
    background: #545c64;
    cursor: pointer;

    img {
      width: 40px;
      height: 40px;
      border-radius: 0;
      margin: 10px 10px 10px 10px;
      float: left;
    }

    div {
      font-size: 22px;
      color: white;
      text-align: left;
      padding-left: 20px;
    }
  }

  .menu-bar-width {
    width: 200px;
  }

  .menu-bar-collapse-width {
    width: 65px;
  }
}
</style>
