<template>
  <el-container>
    <el-header height="30px">
      <el-row :gutter="6">
        <el-col :span="3">
          <el-select v-model="postCategoryName" filterable placeholder="请选择分类" v-on:change="categoryChange">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="20">
          <el-input v-model="postTitle" placeholder="文章标题"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" plain>保存</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <v-md-editor
        v-model="postContent"
        :default-show-toc="true"
        :codemirror-style-reset="true"
        @fullscreen-change="fullscreenChange"
        height="750px"/>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "EditPost",
  data() {
    return {
      postTitle: '',
      postCategoryName: '',
      postCategoryId: 0,
      postContent: '',
      post: null,
      categories: [],
    }
  },
  mounted() {
    this.loadPost()
    this.loadCategories()
  },
  methods: {
    fullscreenChange(isFullscreen) {
      this.$store.commit('onFullscreenChange')
    },
    categoryChange(categoryId) {
      this.postCategoryId = categoryId
    },
    loadPost() {
      let id = this.$route.params.id
      if (id) {
        this.$api.blogPost.get(id)
          .then(res => {
            this.post = res.data
            this.postTitle = this.post.title
            this.postContent = this.post.content
            this.postCategoryId =this.post.categoryId
            this.postCategoryName = this.post.category.name
          })
          .catch(res => this.$message.error(`获取信息失败。${res.message}`))
      } else
        this.$message.error('文章ID未指定')
    },
    loadCategories() {
      this.$api.category.getAll().then(res => this.categories = res.data)
    },
  }
}
</script>

<style scoped>
.v-md-editor {
  text-align: start;
}
</style>
