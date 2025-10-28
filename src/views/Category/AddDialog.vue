<template>
  <el-dialog 
    :title="mode === 'add' ? '添加分类' : '编辑分类'" 
    :visible.sync="dialogFormVisible" 
    width="480px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    class="modern-dialog"
    @close="handleDialogClose">
    
    <!-- 对话框头部 -->
    <div slot="title" class="dialog-header">
      <div class="header-content">
        <i class="el-icon-folder-add header-icon" v-if="mode === 'add'"></i>
        <i class="el-icon-edit header-icon" v-else></i>
        <span class="header-title">{{ mode === 'add' ? '添加分类' : '编辑分类' }}</span>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="dialog-body">
      <el-form 
        ref="uploadForm" 
        :model="form" 
        :rules="formRules"
        label-width="100px" 
        label-position="top"
        class="modern-form">
        
        <!-- 分类名称 -->
        <el-form-item label="分类名称" prop="name" class="form-item">
          <el-input 
            v-model="form.name" 
            placeholder="请输入分类名称"
            autocomplete="off"
            class="modern-input"
            :prefix-icon="'el-icon-edit-outline'">
          </el-input>
        </el-form-item>

        <!-- 父级分类 -->
        <el-form-item label="父级分类" prop="parentId" class="form-item">
          <!-- 子分类模式：显示只读的父分类信息 -->
          <div v-if="isSubCategoryMode && presetParentCategory" class="preset-parent-info">
            <el-input 
              :value="presetParentCategory.name"
              readonly
              class="modern-input readonly-input"
              :prefix-icon="'el-icon-folder'"
            >
              <template slot="suffix">
                <span class="readonly-label">已锁定</span>
              </template>
            </el-input>
            <div class="preset-parent-desc">
              <i class="el-icon-info"></i>
              <span>将在"{{ presetParentCategory.name }}"分类下创建子分类</span>
            </div>
          </div>
          
          <!-- 普通模式：可选择父分类 -->
          <el-cascader 
            v-else
            v-model="form.parentId" 
            :options="categoriesTree" 
            placeholder="请选择父级分类（留空为顶级分类）"
            filterable 
            clearable
            class="modern-cascader"
            :props="{
              checkStrictly: true,
              expandTrigger: 'hover',
              emitPath: false,
              label: 'name',
              value: 'id',
              children: 'children'
            }"
            :show-all-levels="false">
            <template slot-scope="{ node, data }">
              <div class="cascader-node">
                <i class="el-icon-folder" v-if="data.children && data.children.length > 0"></i>
                <i class="el-icon-document" v-else></i>
                <span class="node-label">{{ data.name }}</span>
                <span class="node-count" v-if="data.count">({{ data.count }})</span>
              </div>
            </template>
          </el-cascader>
        </el-form-item>

        <!-- 可见性设置 -->
        <el-form-item label="可见性" prop="visible" class="form-item">
          <div class="visibility-control">
            <el-switch 
              v-model="form.visible"
              active-text="公开显示"
              inactive-text="隐藏分类"
              active-color="#13ce66"
              inactive-color="#ff4949"
              class="modern-switch">
            </el-switch>
            <div class="visibility-desc">
              <span v-if="form.visible" class="desc-text success">
                <i class="el-icon-view"></i>
                该分类将在前台显示
              </span>
              <span v-else class="desc-text warning">
                <i class="el-icon-view"></i>
                该分类将被隐藏
              </span>
            </div>
          </div>
        </el-form-item>

      </el-form>
    </div>

    <!-- 对话框底部 -->
    <div slot="footer" class="dialog-footer">
      <div class="footer-buttons">
        <el-button 
          @click="close" 
          class="cancel-btn"
          size="medium">
          <i class="el-icon-close"></i>
          取消
        </el-button>
        <el-button 
          type="primary" 
          @click="submitUpload"
          :loading="submitLoading"
          class="submit-btn"
          size="medium">
          <i class="el-icon-check" v-if="!submitLoading"></i>
          {{ mode === 'add' ? '添加分类' : '保存修改' }}
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {getNodes} from "@/http/modules/category";

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
      categoriesTree: [],
      submitLoading: false,
      isSubCategoryMode: false, // 是否为添加子分类模式
      presetParentCategory: null, // 预设的父分类信息
      form: {
        name: '',
        url: '',
        description: null,
        visible: true,
        parentId: null
      },
      formRules: {
        name: [
          {required: true, message: '请输入分类名称', trigger: 'blur'},
          {min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur'}
        ],
        visible: [
          {required: true, message: '请选择可见性', trigger: 'change'}
        ],
      }
    }
  },
  created() {
    this.loadCategories()
  },
  methods: {
    /**
     * 将分类数据转换为树形结构
     */
    mapCategoriesToTree(categories) {
      const mapNodes = (nodes) => {
        let items = []
        if (!nodes) return null
        for (const node of nodes) {
          items.push({
            id: node.id,
            name: node.text,  // API返回的是text字段，不是name
            label: node.text, // 显示标签使用text
            value: node.id,
            count: node.tags ? parseInt(node.tags[0]) : 0, // tags数组第一个元素是文章数量
            children: mapNodes(node.nodes)
          })
        }
        return items
      }
      return mapNodes(categories)
    },

    /**
     * 重置表单
     */
    resetForm() {
      if (this.$refs.uploadForm) {
        this.$refs.uploadForm.resetFields()
      }
      this.form = {
        id: 0,
        name: '',
        url: '',
        description: null,
        visible: true,
        parentId: null
      }
      this.submitLoading = false
      // 重置子分类模式相关状态
      this.isSubCategoryMode = false
      this.presetParentCategory = null
    },

    /**
     * 显示对话框
     */
    show() {
      this.dialogFormVisible = true
    },

    /**
     * 隐藏对话框
     */
    hide() {
      this.dialogFormVisible = false
    },

    /**
     * 关闭对话框
     */
    close() {
      this.resetForm()
      this.hide()
    },

    /**
     * 处理对话框关闭事件
     */
    handleDialogClose() {
      this.resetForm()
    },

    /**
     * 添加分类
     */
    add() {
      this.mode = 'add'
      this.resetForm()
      this.show()
    },

    /**
     * 添加子分类
     */
    addSubCategory(parentCategory) {
      this.mode = 'add'
      this.resetForm()
      
      // 设置子分类模式
      this.isSubCategoryMode = true
      this.presetParentCategory = parentCategory
      this.form.parentId = parentCategory.id
      
      this.show()
    },

    /**
     * 编辑分类
     */
    edit(item) {
      this.mode = 'edit'
      this.form = {
        ...item,
        visible: Boolean(item.visible)
      }
      this.show()
    },

    /**
     * 加载分类列表
     */
    loadCategories() {
      getNodes()
        .then(res => {
          this.categories = res.data
          // 为树形组件准备数据
          this.categoriesTree = this.mapCategoriesToTree(res.data)
        })
        .catch(res => {
          this.$message({message: `加载分类列表失败：${res.message}`, type: 'error'})
        })
    },

    /**
     * 提交表单
     */
    submitUpload() {
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) return false

        this.submitLoading = true

        // 处理parentId为null的情况
        const formData = {
          ...this.form,
          parentId: this.form.parentId || 0
        }

        if (this.mode === 'add') {
          this.$api.category.add(formData)
            .then(res => {
              if (res.successful) {
                this.$message({
                  message: '添加分类成功！', 
                  type: 'success',
                  duration: 3000
                })
                this.$emit('onAddSucceed')
                this.close()
                // 重新加载分类数据
                this.loadCategories()
              }
            })
            .catch(res => {
              this.$message({
                message: `添加分类失败：${res.message}`, 
                type: 'error',
                duration: 5000
              })
            })
            .finally(() => {
              this.submitLoading = false
            })
        }

        if (this.mode === 'edit') {
          this.$api.category.update(formData)
            .then(res => {
              if (res.successful) {
                this.$message({
                  message: '修改分类成功！', 
                  type: 'success',
                  duration: 3000
                })
                this.$emit('onUpdateSucceed')
                this.close()
                // 重新加载分类数据
                this.loadCategories()
              }
            })
            .catch(res => {
              this.$message({
                message: `修改分类失败：${res.message}`, 
                type: 'error',
                duration: 5000
              })
            })
            .finally(() => {
              this.submitLoading = false
            })
        }
      })
    },
  }
}
</script>

<style scoped lang="scss">
// 主题色彩变量
$primary-color: #1993DFFF;
$success-color: #13ce66;
$warning-color: #ff9900;
$danger-color: #ff4949;
$text-primary: #303133;
$text-regular: #606266;
$text-secondary: #909399;
$border-color: #dcdfe6;
$border-light: #e4e7ed;
$bg-color: #f5f7fa;

// 现代化对话框样式
.modern-dialog {
  ::v-deep .el-dialog {
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    
    .el-dialog__header {
      padding: 0;
      border-bottom: 1px solid $border-light;
    }
    
    .el-dialog__body {
      padding: 0;
    }
    
    .el-dialog__footer {
      padding: 0;
      border-top: 1px solid $border-light;
    }
  }
}

// 对话框头部样式
.dialog-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, $primary-color 0%, lighten($primary-color, 10%) 100%);
  color: white;
  
  .header-content {
    display: flex;
    align-items: center;
    
    .header-icon {
      font-size: 20px;
      margin-right: 12px;
      opacity: 0.9;
    }
    
    .header-title {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
  }
}

// 对话框主体样式
.dialog-body {
  padding: 32px 24px;
  background: #ffffff;
  
  .modern-form {
    .form-item {
      margin-bottom: 28px;
      
      ::v-deep .el-form-item__label {
        color: $text-primary;
        font-weight: 600;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 8px;
        padding: 0;
      }
      
      ::v-deep .el-form-item__content {
        line-height: 1.5;
      }
    }
  }
}

// 现代化输入框样式
.modern-input {
  ::v-deep .el-input__inner {
    border-radius: 8px;
    border: 2px solid $border-light;
    padding: 12px 16px;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(25, 147, 223, 0.1);
    }
    
    &:hover {
      border-color: darken($border-light, 10%);
    }
  }
  
  ::v-deep .el-input__prefix {
    left: 12px;
    color: $text-secondary;
  }
}

// 现代化级联选择器样式
.modern-cascader {
  width: 100%;
  
  ::v-deep .el-cascader {
    width: 100%;
    
    .el-input__inner {
      border-radius: 8px;
      border: 2px solid $border-light;
      padding: 12px 16px;
      font-size: 14px;
      transition: all 0.3s ease;
      
      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba(25, 147, 223, 0.1);
      }
      
      &:hover {
        border-color: darken($border-light, 10%);
      }
    }
  }
  
  // 级联选择器节点样式
  .cascader-node {
    display: flex;
    align-items: center;
    width: 100%;
    
    i {
      margin-right: 8px;
      color: $primary-color;
      font-size: 14px;
    }
    
    .node-label {
      flex: 1;
      color: $text-primary;
      font-size: 14px;
    }
    
    .node-count {
      color: $text-secondary;
      font-size: 12px;
      margin-left: 8px;
    }
  }
}

// 可见性控制样式
.visibility-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .modern-switch {
    ::v-deep .el-switch__label {
      font-size: 14px;
      font-weight: 500;
      
      &.is-active {
        color: $success-color;
      }
    }
  }
  
  .visibility-desc {
    .desc-text {
      display: flex;
      align-items: center;
      font-size: 13px;
      padding: 8px 12px;
      border-radius: 6px;
      
      i {
        margin-right: 6px;
        font-size: 14px;
      }
      
      &.success {
        color: $success-color;
        background: rgba(19, 206, 102, 0.1);
        border: 1px solid rgba(19, 206, 102, 0.2);
      }
      
      &.warning {
        color: $warning-color;
        background: rgba(255, 153, 0, 0.1);
        border: 1px solid rgba(255, 153, 0, 0.2);
      }
    }
  }
}

// 对话框底部样式
.dialog-footer {
  padding: 20px 24px;
  background: $bg-color;
  
  .footer-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    
    .cancel-btn {
      border-radius: 8px;
      padding: 10px 20px;
      font-weight: 500;
      border: 2px solid $border-color;
      color: $text-regular;
      background: white;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: $text-secondary;
        color: $text-primary;
        transform: translateY(-1px);
      }
      
      i {
        margin-right: 6px;
      }
    }
    
    .submit-btn {
      border-radius: 8px;
      padding: 10px 24px;
      font-weight: 600;
      background: linear-gradient(135deg, $primary-color 0%, darken($primary-color, 5%) 100%);
      border: none;
      box-shadow: 0 4px 12px rgba(25, 147, 223, 0.3);
      transition: all 0.3s ease;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(25, 147, 223, 0.4);
      }
      
      &:active {
        transform: translateY(0);
      }
      
      i {
        margin-right: 6px;
      }
    }
  }
}

// 级联选择器下拉面板样式
::v-deep .el-cascader-panel {
  .el-cascader-node {
    &:hover {
      background: rgba(25, 147, 223, 0.05);
    }
    
    &.is-selectable.in-active-path {
      color: $primary-color;
      font-weight: 500;
    }
    
    &.is-active {
      color: $primary-color;
      font-weight: 600;
      background: rgba(25, 147, 223, 0.1);
    }
  }
  
  .el-cascader-node__postfix {
    color: $primary-color;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .modern-dialog {
    ::v-deep .el-dialog {
      width: 95% !important;
      margin: 20px auto !important;
    }
  }
  
  .dialog-body {
    padding: 24px 16px;
  }
  
  .dialog-footer {
    padding: 16px;
    
    .footer-buttons {
      flex-direction: column;
      
      .cancel-btn,
      .submit-btn {
        width: 100%;
        margin: 0;
      }
    }
  }
}

// 动画效果
.modern-dialog {
  ::v-deep .el-dialog {
    animation: dialogFadeIn 0.3s ease-out;
  }
}

@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 表单验证错误样式优化
::v-deep .el-form-item.is-error {
  .el-input__inner,
  .el-cascader .el-input__inner {
    border-color: $danger-color;
    box-shadow: 0 0 0 3px rgba(255, 73, 73, 0.1);
  }
  
  .el-form-item__error {
    color: $danger-color;
    font-size: 12px;
    margin-top: 6px;
    padding-left: 4px;
  }
}

// 加载状态样式
::v-deep .el-button.is-loading {
  pointer-events: none;
  
  .el-icon-loading {
    margin-right: 6px;
  }
}

// 预设父分类信息样式
.preset-parent-info {
  .readonly-input {
    ::v-deep .el-input__inner {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      color: #495057;
      cursor: not-allowed;
    }
    
    .readonly-label {
      font-size: 12px;
      color: #6c757d;
      background: #e9ecef;
      padding: 2px 8px;
      border-radius: 12px;
      margin-right: 8px;
    }
  }
  
  .preset-parent-desc {
    display: flex;
    align-items: center;
    margin-top: 8px;
    padding: 8px 12px;
    background: rgba(25, 147, 223, 0.05);
    border: 1px solid rgba(25, 147, 223, 0.15);
    border-radius: 6px;
    font-size: 13px;
    color: #495057;
    
    i {
      color: $primary-color;
      margin-right: 6px;
      font-size: 14px;
    }
  }
}
</style>
