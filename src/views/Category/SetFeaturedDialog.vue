<template>
  <el-dialog title="推荐分类信息" :visible.sync="dialogFormVisible">
    <el-form ref="form" :model="form">
      <el-form-item label="推荐名称" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="说明" :label-width="formLabelWidth">
        <el-input v-model="form.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="图标类名" :label-width="formLabelWidth">
        <el-input v-model="form.iconCssClass" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "SetFeaturedDialog",
  props: {
    category: {
      type: Object
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        name: '',
        description: '',
        iconCssClass: ''
      },
      formRules: {
        name: [
          {required: true, message: '请输入推荐名称', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        description: [
          {required: true, message: '请输入说明', trigger: 'blur'},
          {min: 1, max: 300, message: '长度在 1 到 300 个字符', trigger: 'blur'}
        ],
      }
    }
  },
  methods: {
    show() {
      console.log(this.category)
      this.dialogFormVisible = true
    },
    hide() {
      this.dialogFormVisible = false
    },
    close() {
      this.hide()
      this.$refs.form.resetFields()
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (!valid) return false

        this.$api.category.setFeatured(this.category.id, this.form)
          .then(res => {
            this.$message.success(`操作成功。${res.message}`)
            this.$emit('onAddPhotoSucceed')
          })
          .catch(res => this.$message.error(`操作失败。${res.message}`))
          .finally(() => this.close())
      })
    },
  }
}
</script>

<style scoped>

</style>
