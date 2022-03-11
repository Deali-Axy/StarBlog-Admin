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
        <el-col :span="19">
          <el-input v-model="postTitle" placeholder="文章标题"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="warning" plain @click="onSummaryClick" :style="'width:100%'">简介</el-button>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" plain @click="onSaveClick">保存</el-button>
        </el-col>
      </el-row>
    </el-header>
    <el-main>
      <v-md-editor
        v-model="postContent"
        :default-show-toc="true"
        :codemirror-style-reset="true"
        @save="onEditorSave"
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
      // 编辑模式：new / edit
      mode: 'new',
      postTitle: '',
      postCategoryName: '',
      postCategoryId: 0,
      postContent: '',
      postSummary: '',
      post: null,
      categories: [],
    }
  },
  mounted() {
    this.init()
    this.loadCategories()
  },
  methods: {
    // 全屏切换
    fullscreenChange(isFullscreen) {
      this.$store.commit('onFullscreenChange')
    },
    // 分类切换
    categoryChange(categoryId) {
      this.postCategoryId = categoryId
    },
    // 初始化
    init() {
      let id = this.$route.params.id
      if (id) {
        this.mode = 'edit'
        this.$api.blogPost.get(id)
          .then(res => {
            this.post = res.data
            this.postTitle = this.post.title
            this.postContent = this.post.content
            this.postSummary = this.post.summary
            this.postCategoryId = this.post.categoryId
            this.postCategoryName = this.post.category.name
            this.$notify.info({title: '当前模式：修改文章', message: `加载文章：${this.postTitle}`})
          })
          .catch(res => this.$message.error(`获取信息失败。${res.message}`))
      } else {
        this.mode = 'new'
        this.post = {}
      }
    },
    loadCategories() {
      this.$api.category.getAll().then(res => this.categories = res.data)
    },
    onEditorSave(text, html) {
      this.save()
    },
    onSaveClick() {
      this.save()
    },
    onSummaryClick() {
      this.$prompt('请输入文章简介', '提示', {
        inputValue: this.postSummary
      })
        .then(({value}) => {
          this.postSummary = value
          this.$notify.success(`编辑简介成功：${value}`)
        })
        .catch(() => this.$message.info('取消输入'));
    },
    save() {
      let post = this.post
      post.title = this.postTitle
      post.content = this.postContent
      post.summary = this.postSummary
      post.categoryId = this.postCategoryId

      if (this.mode === 'new') {
        this.$api.blogPost.add(post)
          .then(res => this.$message.success(`保存成功。${res.message}`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
      } else {
        this.$api.blogPost.update(post)
          .then(res => this.$message.success(`保存成功。${res.message}`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
      }
    }
  }
}
</script>

<style scoped>
.v-md-editor {
  text-align: start;
}
</style>
