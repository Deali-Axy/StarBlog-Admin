<template>
  <el-dialog title="编辑图片" :visible.sync="dialogVisible" width="30%">
    <el-form ref="editForm" :model="form" :rules="formRules" label-width="80px">
      <el-form-item label="图片名称" prop="title">
        <el-input v-model="form.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="拍摄地点" prop="location">
        <el-input v-model="form.location" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUpdate">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'EditPhotoDialog',
  data() {
    return {
      dialogVisible: false,
      form: {
        id: null,
        title: '',
        location: '',
      },
      formRules: {
        title: [
          { required: true, message: '请输入图片标题', trigger: 'blur' },
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        location: [{ required: true, message: '请输入拍摄地点', trigger: 'blur' }],
      }
    }
  },
  methods: {
    show(photo) {
      this.form.id = photo.id
      this.form.title = photo.title || ''
      this.form.location = photo.location || ''
      this.dialogVisible = true
    },
    hide() {
      this.dialogVisible = false
    },
    close() {
      this.hide()
      this.$refs.editForm && this.$refs.editForm.resetFields()
    },
    submitUpdate() {
      this.$refs.editForm.validate(async (valid) => {
        if (!valid) return
        try {
          await this.$api.photo.update({ id: this.form.id, title: this.form.title, location: this.form.location })
          this.$message.success('更新图片信息成功')
          this.$emit('onUpdateSucceed')
          this.close()
        } catch (err) {
          this.$message.error(`更新失败：${err.message || err}`)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>