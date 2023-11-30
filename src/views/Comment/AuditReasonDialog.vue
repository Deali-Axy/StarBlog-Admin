<template>
  <el-dialog title="审核评论 - 补充原因" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="uploadForm" :model="form" :rules="formRules" label-width="120px">
      <el-form-item label="请输入原因" prop="reason">
        <el-input v-model="form.reason" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "AuditReasonDialog",
  props: {
    onAddSucceed: {
      type: Function
    },
    onUpdateSucceed: {
      type: Function
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      mode: 'accept',
      itemId: '',
      form: {
        reason: '',
      },
      formRules: {
        reason: [{required: true, message: '请输入原因', trigger: 'blur'},],
      }
    }
  },
  methods: {
    resetForm() {
      if (this.$refs.uploadForm) {
        this.$refs.uploadForm.resetFields()
      }
      this.form = {
        reason: '',
      }
    },
    show() {
      this.dialogFormVisible = true
    },
    hide() {
      this.dialogFormVisible = false
    },
    close() {
      this.resetForm()
      this.hide()
    },
    accept(itemId) {
      this.itemId = itemId
      this.mode = 'accept'
      this.resetForm()
      this.show()
    },
    reject(itemId) {
      this.itemId = itemId
      this.mode = 'reject'
      this.resetForm()
      this.show()
    },
    submitUpload() {
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) return false

        if (this.mode === 'accept') {
          this.$emit('onAccept', this.itemId, this.form.reason)
          this.close()
        }

        if (this.mode === 'reject') {
          this.$emit('onReject', this.itemId, this.form.reason)
          this.close()
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
