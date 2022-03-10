<template>
  <el-container>
    <el-header height="30px">
      <el-row :gutter="6">
        <el-col :span="23">
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
      postContent: '',
      post: null,
    }
  },
  mounted() {
    let id = this.$route.params.id
    if (id) {
      this.$api.blogPost.get(id)
        .then(res => {
          this.post = res.data
          this.postTitle = this.post.title
          this.postContent = this.post.content
        })
        .catch(res => this.$message.error(`获取信息失败。${res.message}`))
    } else
      this.$message.error('文章ID未指定')
  },
  methods: {
    fullscreenChange(isFullscreen) {
      console.log('切换全屏', isFullscreen)
      this.$store.commit('onFullscreenChange')
    }
  }
}
</script>

<style scoped>
.v-md-editor {
  text-align: start;
}
</style>
