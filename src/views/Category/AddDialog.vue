<template>
  <el-dialog title="添加分类" :visible.sync="dialogFormVisible" width="30%">
    <el-form ref="uploadForm" :model="form" :rules="formRules"
             label-width="80px" label-position="left">
      <el-form-item label="name" prop="name">
        <el-input v-model="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="parentId" prop="parentId">
        <el-select v-model="form.parentId" placeholder="请选择">
          <el-option
            v-for="item in categories"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="visible" prop="visible">
        <el-switch v-model="form.visible"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUpload">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getAll} from "@/http/modules/category";

export default {
  name: "addCategoryDialog",
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
      mode: 'add',
      categories: [],
      form: {
        name: '',
        url: '',
        description: null,
        visible: 1
      },
      formRules: {
        name: [{required: true, message: '请输入 name', trigger: 'blur'},],
        parentId: [{required: true, message: '请输入 parentId', trigger: 'blur'},],
        visible: [{required: true, message: '请输入 visible', trigger: 'blur'},],
      }
    }
  },
  created() {
    this.loadCategories()
  },
  methods: {
    resetForm() {
      if (this.$refs.uploadForm) {
        this.$refs.uploadForm.resetFields()
      }
      this.form = {
        id: 0,
        name: '',
        url: '',
        description: null,
        visible: true
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
    add() {
      this.mode = 'add'
      this.resetForm()
      this.show()
    },
    edit(item) {
      this.mode = 'edit'
      this.form = item
      this.show()
    },
    loadCategories() {
      getAll()
        .then(res => {
          this.categories = [
            {id: 0, name: '[顶级分类]'},
            ...res.data
          ]
        })
        .catch(res => {
          this.$message({message: `${res.message}`, type: 'error'})
        })
    },
    submitUpload() {
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) return false

        if (this.mode === 'add') {
          this.$api.category.add(this.form)
            .then(res => {
              if (res.successful) {
                this.$message({message: '添加成功', type: 'success'})
                this.$emit('onAddSucceed')
                this.close()
              }
            })
            .catch(res => {
              this.$message({message: `添加失败！${res.message}`, type: 'error'})
            })
        }

        if (this.mode === 'edit') {
          this.$api.category.update(this.form)
            .then(res => {
              if (res.successful) {
                this.$message({message: '修改成功', type: 'success'})
                this.$emit('onUpdateSucceed')
                this.close()
              }
            })
            .catch(res => {
              this.$message({message: `修改失败！${res.message}`, type: 'error'})
            })
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
