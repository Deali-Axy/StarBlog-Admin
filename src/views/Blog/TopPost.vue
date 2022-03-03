<template>
  <el-result icon="info" title="置顶文章" subTitle="当前置顶文章信息">
    <template slot="extra">
      <p>ID：{{ data.id }}</p>
      <p>标题：{{ data.title }}</p>
      <p>分类：{{ data.category.name }}</p>
      <el-button type="primary" size="medium" @click="viewPost" plain>查看文章</el-button>
    </template>
  </el-result>
</template>

<script>
export default {
  name: "TopPost",
  data() {
    return {
      data: null
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$api.blog.top()
        .then(res => this.data = res.data)
    },
    viewPost() {
      this.$message('功能未实现')
    }
  }
}
</script>

<style scoped>

</style>
