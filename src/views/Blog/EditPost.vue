<template>
  <div class="pb-5">
    <el-input v-model="postTitle" placeholder="文章标题"></el-input>


    <v-md-editor
      class="mb-3"
      v-model="postContent"
      :default-show-toc="true"
      :codemirror-style-reset="true"
      :disabled-menus="mode==='edit' ? [] : ['image/upload-image']"
      @save="onEditorSave"
      @fullscreen-change="fullscreenChange"
      @upload-image="handleUploadImage"
      height="750px"/>

    <el-form label-position="top" label-width="80px" :model="form" class="text-start mt-5">
      <el-form-item label="文章选项" prop="isPublish">
        <el-radio v-model="form.isPublish" :label="true">发表</el-radio>
        <el-radio v-model="form.isPublish" :label="false">保存草稿</el-radio>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="URL Slug (友好地址名，只能使用字母、数字、-连字符、_下划线，不超过150个字符)" prop="slug">
            <el-input v-model="form.slug" maxlength="150" show-word-limit placeholder="Slug"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分类" prop="category">
            <el-cascader class="w-100" :options="categoryTree" :props="{
                checkStrictly:true,
                expandTrigger:'hover',
                emitPath:false,
              }" v-model="form.category" filterable></el-cascader>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="简介" prop="summary">
        <el-input type="textarea" v-model="form.summary" :rows="8" maxlength="200" show-word-limit
                  placeholder="简介"></el-input>
      </el-form-item>
    </el-form>

    <el-button type="primary" plain @click="onSaveClick">保存</el-button>

  </div>
</template>

<script>
// todo 应该增加一个关闭页面提示，或者是关闭页面自动保存的功能~

export default {
  name: "EditPost",
  data() {
    return {
      // 编辑模式：new / edit
      mode: 'new',
      postTitle: '',
      postContent: '',
      post: null,
      categories: [],
      categoryTree: [],
      form: {
        isPublish: false,
        slug: '',
        summary: '',
        category: 0,
      }
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
    /**
     * 上传图片处理
     * @param event
     * @param insertImage Function
     * @param files
     */
    handleUploadImage(event, insertImage, files) {
      let file = files[0]

      this.$api.blogPost.uploadImage(this.post.id, file)
        .then(res => {
          this.$message.success(`添加图片：${res.data.imgName}`)
          insertImage({
            url: res.data.imgUrl.replaceAll('\\', '/'),
            desc: res.data.imgName
          })
        })
        .catch(res => this.$message.error(`上传图片失败。${res.message}`))
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
            this.form.slug = this.post.slug
            this.form.isPublish = this.post.isPublish
            this.form.summary = this.post.summary
            this.form.category = this.post.categoryId
            this.$notify.info({title: '当前模式：修改文章', message: `加载文章：${this.postTitle}`})
          })
          .catch(res => this.$message.error(`获取信息失败。${res.message}`))
      } else {
        this.mode = 'new'
        this.post = {}
        this.$notify.warning({title: '当前模式：新建文章', message: '注意：只有保存文章之后才能上传图片！'})
      }
    },
    loadCategories() {
      const mapNodes = (nodes) => {
        let items = []
        if (!nodes) return null
        for (const node of nodes) {
          items.push({
            label: `${node.text} (${node.tags[0]})`,
            value: node.id,
            children: mapNodes(node.nodes)
          })
        }
        return items
      }

      this.$api.category.getNodes().then(res => this.categoryTree = mapNodes(res.data))
      this.$api.category.getAll().then(res => this.categories = res.data)
    },
    onEditorSave(text, html) {
      this.save()
    },
    onSaveClick() {
      this.save()
    },
    save() {
      let post = this.post
      post.title = this.postTitle
      post.content = this.postContent
      post.isPublish = this.form.isPublish
      post.slug = this.form.slug
      post.summary = this.form.summary
      post.categoryId = this.form.category

      if (this.mode === 'new') {
        this.$api.blogPost.add(post)
          .then(res => {
            this.$message.success(`保存成功。${res.message}`)
            // 新建完就跳转到编辑页面
            this.$router.push(`/post/edit/${res.data.id}`)
          })
          .catch(res => {
            console.log(res)
            this.$message.error(`操作失败。${res.message}`)
          })
      } else {
        this.$api.blogPost.update(post)
          .then(res => this.$message.success(`保存成功。${res.message}`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
      }
    }
  }
}
</script>

<style lang="scss">
.v-md-editor {
  text-align: start;

  .codemirror-wrapper {
    .CodeMirror {
      font-size: 18px !important;
    }
  }
}
</style>
