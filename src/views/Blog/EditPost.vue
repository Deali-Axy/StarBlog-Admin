<template>
  <div class="pb-5">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="my-3">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/post/list' }">文章管理</el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode==='edit'">编辑文章</el-breadcrumb-item>
      <el-breadcrumb-item v-if="mode==='new'">新建文章</el-breadcrumb-item>
    </el-breadcrumb>

    <el-divider></el-divider>

    <div class="d-flex justify-content-between mb-1">
      <div>标题</div>
      <el-link v-if="post!==null" type="primary" target="_blank">{{ `${baseUrl}/Blog/Post/${post.id}` }}</el-link>
    </div>
    <el-input v-model="postTitle" placeholder="文章标题" class="mb-3"></el-input>

    <div class="mb-1">内容</div>
    <v-md-editor
      class="mb-4"
      v-model="postContent"
      :default-show-toc="true"
      :codemirror-style-reset="true"
      :disabled-menus="mode==='edit' ? [] : ['image/upload-image']"
      @save="onEditorSave"
      @fullscreen-change="fullscreenChange"
      @upload-image="handleUploadImage"
      height="750px"/>

    <el-divider></el-divider>

    <el-descriptions title="文章信息" :column="2" border>
      <el-descriptions-item label="文章ID">{{ post.id }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag size="small">{{ post.status }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="添加时间">{{ post.creationTime }}</el-descriptions-item>
      <el-descriptions-item label="修改时间">{{ post.lastUpdateTime }}</el-descriptions-item>
    </el-descriptions>

    <el-divider content-position="left">文章选项</el-divider>

    <el-form label-position="left" label-width="auto" :model="form" class="text-start">
      <el-form-item label="模式" prop="isPublish">
        <el-radio v-model="form.isPublish" :label="true">发表</el-radio>
        <el-radio v-model="form.isPublish" :label="false">保存草稿</el-radio>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="Slug" prop="slug">
            <el-input v-model="form.slug" maxlength="150" show-word-limit placeholder="Slug"></el-input>
            <small>友好地址名，只能使用字母、数字、-连字符、_下划线，不超过150个字符</small>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分类" prop="category">
            <el-cascader class="w-100" :options="categoryTree" clearable :props="{
                checkStrictly:true,
                expandTrigger:'hover',
                emitPath:false,
              }" v-model="form.category" filterable></el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文章标记" prop="status">
            <el-input v-model="form.status" maxlength="20" show-word-limit placeholder="Status"></el-input>
            <small>提取原markdown文件的文件名前缀，用于区分文章状态。如：未完成、老文</small>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="简介" prop="summary">
        <el-input type="textarea" v-model="form.summary" :rows="8" maxlength="200" show-word-limit
                  placeholder="简介"></el-input>
      </el-form-item>
    </el-form>

    <div class="text-end">
      <el-button type="primary" plain @click="onSaveClick" :loading="saveButtonLoading">保存</el-button>
    </div>
  </div>
</template>

<script>
// todo 应该增加一个关闭页面提示，或者是关闭页面自动保存的功能~
import {baseUrl} from "@/utils/global";
import {dateTimeBeautify} from "@/utils/dateTime";
import VMdEditor from "@kangc/v-md-editor/lib/codemirror-editor";

export default {
  name: "EditPost",
  components: {
    VMdEditor
  },
  data() {
    return {
      baseUrl: baseUrl,
      // 编辑模式：new / edit
      mode: 'new',
      postTitle: '',
      postContent: '',
      post: null,
      categories: [],
      categoryTree: [],
      form: {
        isPublish: false,
        status: '',
        slug: '',
        summary: '',
        category: 0,
      },
      saveButtonLoading: false,
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
            this.post.creationTime = dateTimeBeautify(this.post.creationTime)
            this.post.lastUpdateTime = dateTimeBeautify(this.post.lastUpdateTime)
            this.form.slug = this.post.slug
            this.form.status = this.post.status
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
      post.status = this.form.status
      post.summary = this.form.summary
      post.categoryId = this.form.category

      this.saveButtonLoading = true

      if (this.mode === 'new') {
        this.$api.blogPost.add(post)
          .then(res => {
            this.$message.success(`保存成功。`)
            // 新建完就跳转到编辑页面
            this.$router.push(`/post/edit/${res.data.id}`)
          })
          .catch(res => {
            console.log(res)
            this.$message.error(`操作失败。${res.message}`)
          })
          .finally(() => this.saveButtonLoading = false)
      } else {
        this.$api.blogPost.update(post)
          .then(res => this.$message.success(`保存成功。`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
          .finally(() => this.saveButtonLoading = false)
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
