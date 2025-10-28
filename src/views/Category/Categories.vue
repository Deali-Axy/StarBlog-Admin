<template>
  <div class="categories-container">
    <!-- 头部操作栏 -->
    <div class="header-actions">
      <div class="search-section">
        <el-input
          v-model="search"
          placeholder="搜索分类..."
          prefix-icon="el-icon-search"
          size="medium"
          style="width: 300px;"
          clearable
        />
      </div>
      <div class="action-buttons">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAdd"
          size="medium"
        >
          添加分类
        </el-button>
      </div>
    </div>

    <!-- 分类卡片网格 -->
    <div class="categories-grid" v-loading="loading">
      <div
        v-for="category in filteredCategories"
        :key="category.id"
        class="category-card"
        @click="viewCategoryDetail(category)"
      >
        <div class="card-header">
          <div class="category-icon">
            <i class="el-icon-folder-opened"></i>
          </div>
          <div class="category-info">
            <h3 class="category-name">{{ category.name }}</h3>
            <p class="category-description">{{ category.description || '暂无描述' }}</p>
          </div>
          <div class="category-status">
            <el-tag
              :type="category.visible ? 'success' : 'info'"
              size="mini"
            >
              {{ category.visible ? '可见' : '隐藏' }}
            </el-tag>
          </div>
        </div>

        <div class="card-content">
          <div class="stats">
            <div class="stat-item">
              <span class="stat-label">文章数量</span>
              <span class="stat-value">{{ category.postCount || 0 }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">上级分类</span>
              <span class="stat-value">{{ category.parentId || '无' }}</span>
            </div>
          </div>
        </div>

        <div class="card-actions" @click.stop>
          <el-button
            size="mini"
            type="text"
            @click="viewCategoryDetail(category)"
            icon="el-icon-document"
          >
            管理文章
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="toggleVisibility(category)"
            :icon="category.visible ? 'el-icon-view' : 'el-icon-hide'"
          >
            {{ category.visible ? '隐藏' : '显示' }}
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="setFeatured(category)"
            icon="el-icon-star-off"
          >
            推荐
          </el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(category)"
            icon="el-icon-delete"
            class="delete-btn"
          >
            删除
          </el-button>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredCategories.length === 0 && !loading" class="empty-state">
        <i class="el-icon-folder-opened empty-icon"></i>
        <p class="empty-text">暂无分类数据</p>
        <el-button type="primary" @click="handleAdd">创建第一个分类</el-button>
      </div>
    </div>

    <!-- 对话框组件 -->
    <add-category-dialog
      ref="addDialog"
      @onAddSucceed="onAddSucceed"
      @onUpdateSucceed="onUpdateSucceed"
    />
    <set-featured-dialog
      v-for="(category, index) in data"
      :key="`featured-${category.id}`"
      :ref="`setFeaturedDialog_${index}`"
      :category="category"
    />
  </div>
</template>

<script>
import AddCategoryDialog from "@/views/Category/AddDialog.vue";
import SetFeaturedDialog from "./SetFeaturedDialog";

export default {
  name: "Categories",
  components: {
    AddCategoryDialog,
    SetFeaturedDialog
  },
  data() {
    return {
      loading: false,
      saving: false,
      data: [],
      search: ''
    }
  },
  computed: {
    filteredCategories() {
      return this.data.filter(item =>
        !this.search || item.name.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    // 数据加载
    async loadData() {
      this.loading = true
      try {
        const res = await this.$api.category.getAll()
        this.data = res.data
      } catch (error) {
        console.error(error)
        this.$message.error(error.message)
      } finally {
        this.loading = false
      }
    },

    // 跳转到分类详情页面
    viewCategoryDetail(category) {
      this.$router.push({
        name: '分类详情',
        params: { id: category.id }
      })
    },

    // 原有功能
    handleAdd() {
      this.$refs.addDialog.add()
    },

    handleEdit(item) {
      this.$refs.addDialog.edit(item)
    },

    handleDelete(item) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$api.category.deleteItem(item.id)
          this.$message.success(`删除成功。${res.message}`)
          this.loadData()
        } catch (error) {
          this.$message.error(`操作失败。${error.message}`)
        }
      }).catch(() => {
        this.$message('已取消删除')
      })
    },

    async toggleVisibility(item) {
      try {
        if (item.visible) {
          await this.$api.category.setInvisible(item.id)
        } else {
          await this.$api.category.setVisible(item.id)
        }
        this.$message.success('操作成功')
        this.loadData()
      } catch (error) {
        this.$message.error(`操作失败：${error.message}`)
      }
    },

    setFeatured(item) {
      const index = this.data.findIndex(cat => cat.id === item.id)
      if (index > -1) {
        this.$refs[`setFeaturedDialog_${index}`][0].show()
      }
    },

    onAddSucceed() {
      this.$message.success('添加成功')
      this.loadData()
    },

    onUpdateSucceed() {
      this.$message.success('保存成功')
      this.loadData()
    },

    // 工具方法
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.categories-container {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

/* 头部操作栏 */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

/* 分类卡片网格 */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.category-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #409eff;
}

.card-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
}

.category-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  flex-shrink: 0;
}

.category-icon i {
  font-size: 24px;
  color: white;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-description {
  font-size: 14px;
  color: #909399;
  margin: 0;
  line-height: 1.4;
}

.category-status {
  margin-left: 12px;
}

.card-content {
  margin-bottom: 16px;
}

.stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.card-actions .el-button {
  padding: 4px 8px;
  font-size: 12px;
}

.delete-btn {
  color: #f56c6c !important;
}

.delete-btn:hover {
  background-color: #fef0f0 !important;
}

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin: 0 0 20px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .categories-container {
    padding: 12px;
  }

  .category-card {
    padding: 16px;
  }

  .stats {
    gap: 16px;
  }

  .card-actions {
    flex-wrap: wrap;
  }
}
</style>
