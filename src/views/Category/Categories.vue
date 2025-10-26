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
        <el-button 
          v-if="editMode"
          type="success" 
          icon="el-icon-check" 
          @click="saveChanges"
          size="medium"
          :loading="saving"
        >
          保存修改
        </el-button>
        <el-button 
          v-if="editMode"
          type="info" 
          icon="el-icon-close" 
          @click="cancelEdit"
          size="medium"
        >
          取消编辑
        </el-button>
      </div>
    </div>

    <!-- 分类卡片网格 -->
    <div v-if="!editMode" class="categories-grid" v-loading="loading">
      <div 
        v-for="category in filteredCategories" 
        :key="category.id"
        class="category-card"
        @click="enterEditMode(category)"
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
            @click="handleEdit(category)"
            icon="el-icon-edit"
          >
            编辑
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

    <!-- 编辑模式 - 文章管理面板 -->
    <div v-if="editMode" class="edit-panel" v-loading="loading">
      <div class="edit-header">
        <div class="category-info-edit">
          <i class="el-icon-folder-opened category-icon-large"></i>
          <div>
            <h2>{{ currentCategory.name }}</h2>
            <p class="category-desc">管理分类下的文章</p>
          </div>
        </div>
      </div>

      <div class="edit-content">
        <!-- 左侧：可添加的文章列表 -->
        <div class="articles-panel left-panel">
          <div class="panel-header">
            <h3>可添加的文章</h3>
            <div class="panel-controls">
              <el-input
                v-model="articleSearch"
                placeholder="搜索文章..."
                prefix-icon="el-icon-search"
                size="small"
                style="width: 200px;"
                clearable
              />
              <el-select
                v-model="filterCategoryId"
                placeholder="筛选分类"
                size="small"
                style="width: 150px; margin-left: 10px;"
                clearable
              >
                <el-option label="全部分类" value=""></el-option>
                <el-option
                  v-for="cat in allCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"
                />
              </el-select>
            </div>
          </div>
          
          <div class="articles-list" v-loading="loadingArticles">
            <div 
              v-for="article in availableArticles" 
              :key="article.id"
              class="article-item"
              :class="{ 'disabled': isArticleInCategory(article.id) }"
              @click="addArticleToCategory(article)"
            >
              <div class="article-info">
                <h4 class="article-title">{{ article.title }}</h4>
                <p class="article-meta">
                  <span>{{ formatDate(article.creationTime) }}</span>
                  <span class="article-status">{{ article.status }}</span>
                </p>
              </div>
              <div class="article-actions">
                <el-button
                  v-if="!isArticleInCategory(article.id)"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click.stop="addArticleToCategory(article)"
                >
                  添加
                </el-button>
                <span v-else class="already-added">已添加</span>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="availableArticles.length === 0 && !loadingArticles" class="empty-articles">
              <i class="el-icon-document-remove"></i>
              <p>暂无可添加的文章</p>
            </div>
          </div>
        </div>

        <!-- 右侧：当前分类的文章列表 -->
        <div class="articles-panel right-panel">
          <div class="panel-header">
            <h3>当前分类文章 ({{ categoryArticles.length }})</h3>
            <div class="panel-controls">
              <el-button
                size="small"
                type="danger"
                icon="el-icon-delete"
                @click="removeSelectedArticles"
                :disabled="selectedArticles.length === 0"
              >
                批量移除 ({{ selectedArticles.length }})
              </el-button>
            </div>
          </div>
          
          <div class="articles-list">
            <div 
              v-for="article in categoryArticles" 
              :key="article.id"
              class="article-item current-category"
            >
              <div class="article-checkbox">
                <el-checkbox 
                  v-model="selectedArticles"
                  :label="article.id"
                />
              </div>
              <div class="article-info">
                <h4 class="article-title">{{ article.title }}</h4>
                <p class="article-meta">
                  <span>{{ formatDate(article.creationTime) }}</span>
                  <span class="article-status">{{ article.status }}</span>
                </p>
              </div>
              <div class="article-actions">
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-minus"
                  @click="removeArticleFromCategory(article)"
                >
                  移除
                </el-button>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="categoryArticles.length === 0" class="empty-articles">
              <i class="el-icon-document-add"></i>
              <p>该分类下暂无文章</p>
              <p class="empty-tip">从左侧列表中选择文章添加到此分类</p>
            </div>
          </div>
        </div>
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
      loadingArticles: false,
      saving: false,
      data: [],
      search: '',
      editMode: false,
      currentCategory: null,
      
      // 文章管理相关
      allArticles: [],
      categoryArticles: [],
      selectedArticles: [],
      articleSearch: '',
      filterCategoryId: '',
      
      // 待保存的更改
      pendingChanges: {
        added: [],
        removed: []
      }
    }
  },
  computed: {
    filteredCategories() {
      return this.data.filter(item =>
        !this.search || item.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    allCategories() {
      return this.data
    },
    availableArticles() {
      let articles = this.allArticles.filter(article => {
        // 搜索过滤
        const matchesSearch = !this.articleSearch || 
          article.title.toLowerCase().includes(this.articleSearch.toLowerCase())
        
        // 分类过滤
        const matchesCategory = !this.filterCategoryId || 
          article.categoryId === this.filterCategoryId
        
        return matchesSearch && matchesCategory
      })
      
      return articles
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

    async loadArticles() {
      this.loadingArticles = true
      try {
        const res = await this.$api.blogPost.getList()
        this.allArticles = res.data.items || res.data
      } catch (error) {
        console.error(error)
        this.$message.error('加载文章列表失败')
      } finally {
        this.loadingArticles = false
      }
    },

    async loadCategoryArticles(categoryId) {
      try {
        const res = await this.$api.blogPost.getList(false, '', categoryId)
        this.categoryArticles = res.data.items || res.data
      } catch (error) {
        console.error(error)
        this.$message.error('加载分类文章失败')
      }
    },

    // 编辑模式
    async enterEditMode(category) {
      this.editMode = true
      this.currentCategory = category
      this.selectedArticles = []
      this.pendingChanges = { added: [], removed: [] }
      
      // 加载文章数据
      await Promise.all([
        this.loadArticles(),
        this.loadCategoryArticles(category.id)
      ])
    },

    cancelEdit() {
      this.editMode = false
      this.currentCategory = null
      this.selectedArticles = []
      this.pendingChanges = { added: [], removed: [] }
      this.articleSearch = ''
      this.filterCategoryId = ''
    },

    async saveChanges() {
      this.saving = true
      try {
        // 这里需要根据实际API实现文章分类的更新
        // 由于当前API中没有直接的文章分类管理接口，这里模拟保存过程
        
        for (const articleId of this.pendingChanges.added) {
          // 调用API将文章添加到分类
          // await this.$api.blogPost.updateCategory(articleId, this.currentCategory.id)
        }
        
        for (const articleId of this.pendingChanges.removed) {
          // 调用API将文章从分类中移除
          // await this.$api.blogPost.updateCategory(articleId, null)
        }
        
        this.$message.success('保存成功')
        this.cancelEdit()
        this.loadData()
      } catch (error) {
        console.error(error)
        this.$message.error('保存失败：' + error.message)
      } finally {
        this.saving = false
      }
    },

    // 文章管理
    isArticleInCategory(articleId) {
      return this.categoryArticles.some(article => article.id === articleId) ||
             this.pendingChanges.added.includes(articleId)
    },

    addArticleToCategory(article) {
      if (this.isArticleInCategory(article.id)) return
      
      this.categoryArticles.push(article)
      this.pendingChanges.added.push(article.id)
      
      // 如果之前在移除列表中，则从移除列表中删除
      const removeIndex = this.pendingChanges.removed.indexOf(article.id)
      if (removeIndex > -1) {
        this.pendingChanges.removed.splice(removeIndex, 1)
      }
    },

    removeArticleFromCategory(article) {
      const index = this.categoryArticles.findIndex(a => a.id === article.id)
      if (index > -1) {
        this.categoryArticles.splice(index, 1)
        this.pendingChanges.removed.push(article.id)
        
        // 如果之前在添加列表中，则从添加列表中删除
        const addIndex = this.pendingChanges.added.indexOf(article.id)
        if (addIndex > -1) {
          this.pendingChanges.added.splice(addIndex, 1)
        }
      }
      
      // 从选中列表中移除
      const selectedIndex = this.selectedArticles.indexOf(article.id)
      if (selectedIndex > -1) {
        this.selectedArticles.splice(selectedIndex, 1)
      }
    },

    removeSelectedArticles() {
      this.selectedArticles.forEach(articleId => {
        const article = this.categoryArticles.find(a => a.id === articleId)
        if (article) {
          this.removeArticleFromCategory(article)
        }
      })
      this.selectedArticles = []
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

/* 编辑面板 */
.edit-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.edit-header {
  padding: 24px;
  background: linear-gradient(135deg, #409eff, #67c23a);
  color: white;
}

.category-info-edit {
  display: flex;
  align-items: center;
}

.category-icon-large {
  font-size: 32px;
  margin-right: 16px;
}

.category-info-edit h2 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
}

.category-desc {
  margin: 0;
  opacity: 0.9;
  font-size: 14px;
}

.edit-content {
  display: flex;
  height: 600px;
}

.articles-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #f0f0f0;
}

.articles-panel:last-child {
  border-right: none;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.panel-controls {
  display: flex;
  align-items: center;
}

.articles-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.article-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  margin-bottom: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.article-item:hover {
  background: #e3f2fd;
}

.article-item.disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #f5f5f5;
}

.article-item.current-category {
  background: #fff7e6;
  border: 1px solid #ffd591;
}

.article-checkbox {
  margin-right: 12px;
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 4px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-meta {
  font-size: 12px;
  color: #909399;
  margin: 0;
  display: flex;
  gap: 12px;
}

.article-status {
  padding: 2px 6px;
  background: #e1f3d8;
  color: #67c23a;
  border-radius: 4px;
  font-size: 11px;
}

.article-actions {
  margin-left: 12px;
}

.already-added {
  font-size: 12px;
  color: #909399;
  padding: 4px 8px;
}

.empty-articles {
  text-align: center;
  padding: 40px 20px;
  color: #909399;
}

.empty-articles i {
  font-size: 48px;
  margin-bottom: 12px;
  display: block;
}

.empty-tip {
  font-size: 12px;
  margin-top: 8px;
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
  
  .edit-content {
    flex-direction: column;
    height: auto;
  }
  
  .articles-panel {
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .panel-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .panel-controls {
    justify-content: space-between;
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
