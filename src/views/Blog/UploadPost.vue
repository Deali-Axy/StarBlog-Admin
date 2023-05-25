<template>
  <el-row>
    <el-col :span="8">
      <el-form ref="uploadForm" :model="form" :rules="formRules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章说明" prop="summary">
          <el-input v-model="form.summary" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="categoryId">
          <el-select v-model="form.categoryId" clearable filterable placeholder="请选择分类"
                     v-on:change="handleCategoryChange">
            <el-option
              v-for="item in categories"
              :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="ZIP压缩包编码" prop="zipEncoding">
          <el-select v-model="form.zipEncoding" clearable filterable placeholder="ZIP压缩包编码">
            <el-option v-for="item in zipCodings" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item>
      </el-form>
      <el-upload ref="upload" drag action=""
                 accept="application/x-zip-compressed,.zip"
                 :file-list="fileList"
                 :on-change="onUploadChange"
                 :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传zip文件</div>
      </el-upload>

      <el-row type="flex" justify="end">
        <el-button type="primary" @click="submitUpload">确 定</el-button>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "UploadPost",
  data() {
    return {
      dialogFormVisible: false,
      fileList: [],
      categories: [],
      currentCategoryName: '',
      currentCategoryId: 0,
      zipCodings: ['utf-8', 'utf-16', 'gbk', 'gb2312'],
      form: {
        title: '',
        summary: '',
        categoryId: null,
        zipEncoding: 'utf-8',
        file: null
      },
      formRules: {
        title: [
          {required: true, message: '请输入文章标题', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
        ],
        summary: [{required: true, message: '请输入文章介绍', trigger: 'blur'}],
        categoryId: [{required: true, message: '请选择文章分类', trigger: 'blur'}],
      }
    }
  },
  mounted() {
    this.loadCategories()
  },
  methods: {
    loadCategories() {
      this.$api.category.getAll()
        .then(res => this.categories = res.data)
        .catch(res => this.$message.error(`获取文章分类出错：${res.message}`))
    },
    handleCategoryChange(categoryId) {
      this.currentCategoryId = categoryId
    },
    onUploadChange(file, fileList) {
      console.log(file.raw.type)
      const isIMAGE = (file.raw.type === 'application/x-zip-compressed')
      if (!isIMAGE) {
        this.$message.error('只能上传zip压缩包!')
        return false
      }

      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }

      this.form.file = file
    },
    submitUpload() {
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) return false

        this.$api.blog.upload(this.form.title, this.form.summary, this.form.categoryId, this.form.file.raw, this.form.zipEncoding)
          .then(res => {
            if (res.successful) {
              this.$message({message: '上传文章成功', type: 'success'})
              this.$router.push('/post/list')
            }
          })
          .catch(res => this.$message.error(`上传文章失败：${res.message}`))
      })
    },
  }
}
</script>

<style scoped>
.el-select {
  width: 100%;
}
</style>
