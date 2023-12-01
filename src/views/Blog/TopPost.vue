<template>
  <el-result icon="info" title="置顶文章" subTitle="当前置顶文章信息">
    <template slot="extra">
      <p>分类：{{ data.category.name }}</p>
      <p>ID：{{ data.id }}</p>
      <el-link type="primary" :href="`${baseUrl}/Blog/Post/${data.id}`" target="_blank">标题：{{ data.title }}</el-link>
    </template>
  </el-result>
</template>

<script>
import {baseUrl} from "@/utils/global";

export default {
  name: "TopPost",
  data() {
    return {
      data: null,
      baseUrl: baseUrl
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
  }
}
</script>

<style scoped>

</style>
