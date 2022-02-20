<template>
  <div class="container">
    <!-- 导航菜单栏 -->
    <navbar></navbar>
    <!-- 头部区域 -->
    <header-bar></header-bar>
    <!-- 主内容区域 -->
    <main-content></main-content>
  </div>
</template>

<script>
import HeaderBar from "./HeaderBar"
import Navbar from "./Navbar"
import MainContent from "./MainContent"

export default {
  // name: 'Home',
  components: {
    HeaderBar,
    Navbar,
    MainContent
  }
};
</script>

<style scoped lang="scss">
.container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
