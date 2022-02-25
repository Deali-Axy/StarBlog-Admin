<template>
  <el-dialog title="上传图片" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="uploadForm" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="图片名称" prop="title">
        <el-input v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="拍摄地点" prop="location">
        <el-input v-model="form.location" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <el-upload ref="upload" drag action=""
               accept="image/jpeg,image/png"
               :file-list="fileList"
               :on-change="onUploadChange"
               :auto-upload="false">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AddPhotoDialog",
  props: {
    onAddPhotoSucceed: {
      type: Function
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      fileList: [],
      form: {
        title: '',
        location: '',
        file: null
      },
      formRules: {
        title: [
          {required: true, message: '请输入图片标题', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
        ],
        location: [{required: true, message: '请输入拍摄地点', trigger: 'blur'}],
      }
    }
  },
  methods: {
    onUploadChange(file, fileList) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
      if (!isIMAGE) {
        this.$message.error('只能上传jpg/png图片!')
        return false
      }

      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }

      this.form.file = file
    },
    show() {
      this.dialogFormVisible = true
    },
    hide() {
      this.dialogFormVisible = false
    },
    close() {
      this.hide()
      this.$refs.uploadForm.resetFields()
    },
    submitUpload() {
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) return false

        this.$api.photo.add(this.form.title, this.form.location, this.form.file.raw)
          .then(res => {
            if (res.successful) {
              this.$message({message: '添加图片成功', type: 'success'})
              this.$emit('onAddPhotoSucceed')
              this.close()
            }
          })
      })
    },
  }
}
</script>

<style scoped>

</style>
