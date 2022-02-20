<template>
  <div class="menu-bar-container">
    <!-- logo -->
    <div class="logo" :style="{'background':themeColor}" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
         @click="$router.push('/')">
      <img v-if="collapse" src="@/assets/codelab.jpg"/>
      <div>{{ collapse ? '' : appName }}</div>
    </div>
    <!-- 导航菜单 -->
    <el-menu default-active="1" :class="collapse?'menu-bar-collapse-width':'menu-bar-width'"
             :collapse="collapse" :collapse-transition="false" :unique-opened="false"
             @open="handleOpen" @close="handleClose" @select="handleSelect">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>博客</span>
        </template>
        <el-menu-item-group title="分类管理">
          <el-menu-item index="1-1">分类列表</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="文章管理">
          <el-menu-item index="1-2">文章列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>摄影</span>
        </template>
        <el-menu-item-group title="照片管理">
          <el-menu-item index="2-1">照片列表</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-menu-item index="3">
        <i class="el-icon-menu"></i>
        <span slot="title">导航2</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航3</span>
      </el-menu-item>
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
    })
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelect(a, b) {
      // console.log('handleSelect', a, b)
      console.log('handleSelect', 'a', a)
      console.log('handleSelect', 'b', b)
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
