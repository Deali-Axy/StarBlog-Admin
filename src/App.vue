<template>
  <div id="app" :class="{ 'has-navbar': hasNavbar }">
<!--    <img src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    hasNavbar() {
      // 登录页面、404页面等不需要导航栏空间的页面
      const fullscreenRoutes = ['/login', '/Login', '/404']
      return !fullscreenRoutes.includes(this.$route.path)
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* 只有需要导航栏的页面才添加顶部边距 */
#app.has-navbar {
  margin-top: 60px;
}
</style>
