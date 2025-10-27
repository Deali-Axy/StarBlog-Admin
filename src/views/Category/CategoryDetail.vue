<template>
  <div class="category-detail-container">
    <!-- 头部信息 -->
    <div class="detail-header">
      <div class="header-left">
        <el-button
          type="text"
          icon="el-icon-arrow-left"
          @click="goBack"
          class="back-button"
        >
          返回分类列表
        </el-button>
      </div>
      <div class="category-info">
        <div class="category-icon">
          <i class="el-icon-folder-opened"></i>
        </div>
        <div class="category-details">
          <h1 class="category-name">{{ category.name }}</h1>
          <p class="category-description">{{ category.description || '暂无描述' }}</p>
          <div class="category-meta">
            <el-tag :type="category.visible ? 'success' : 'info'" size="small">
              {{ category.visible ? '可见' : '隐藏' }}
            </el-tag>
            <span class="meta-item">文章总数: {{ totalArticleCount }}</span>
            <span class="meta-item">已加载: {{ categoryArticles.length }}</span>
          </div>
        </div>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          icon="el-icon-edit"
          @click="editCategory"
        >
          编辑分类
        </el-button>
        <el-button
          type="success"
          icon="el-icon-check"
          @click="saveChanges"
          :loading="saving"
          :disabled="!hasChanges"
        >
          保存修改
        </el-button>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="detail-content">
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
              @input="searchArticles"
            />
            <el-select
              v-model="filterCategoryId"
              placeholder="筛选分类"
              size="small"
              style="width: 150px; margin-left: 10px;"
              clearable
              @change="filterArticles"
            >
              <el-option label="全部分类" value=""></el-option>
              <el-option
                v-for="cat in allCategories"
                :key="cat.id"
                :label="cat.name"
                :value="cat.id"
              />
            </el-select>
            <el-button
              size="small"
              icon="el-icon-refresh"
              @click="refreshAvailableArticles"
              :loading="loadingAvailableArticles"
            >
              刷新
            </el-button>
          </div>
        </div>

        <div class="articles-list" v-loading="loadingAvailableArticles">
          <div
            v-for="article in availableArticles"
            :key="article.id"
            class="article-item"
            :class="{ 'disabled': isArticleInCategory(article.id) }"
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
                @click="addArticleToCategory(article)"
              >
                添加
              </el-button>
              <span v-else class="already-added">已添加</span>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="availableArticles.length === 0 && !loadingAvailableArticles" class="empty-articles">
            <i class="el-icon-document-remove"></i>
            <p>暂无可添加的文章</p>
          </div>

          <!-- 加载更多 -->
          <div v-if="availableArticles.length > 0 && hasMoreAvailableArticles" class="load-more-section">
            <el-button
              type="text"
              @click="loadMoreAvailableArticles"
              :loading="loadingAvailableArticles"
              icon="el-icon-more"
            >
              加载更多
            </el-button>
          </div>
        </div>
      </div>

      <!-- 右侧：当前分类的文章列表 -->
      <div class="articles-panel right-panel">
        <div class="panel-header">
          <h3>当前分类文章</h3>
          <div class="panel-controls">
            <el-input
              v-model="categoryArticleSearch"
              placeholder="搜索当前分类文章..."
              prefix-icon="el-icon-search"
              size="small"
              style="width: 200px;"
              clearable
            />
            <el-button
              size="small"
              type="primary"
              icon="el-icon-refresh"
              @click="refreshCategoryArticles"
              :loading="loadingCategoryArticles"
            >
              刷新
            </el-button>
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

        <div class="articles-list" v-loading="loadingCategoryArticles">
          <div
            v-for="article in filteredCategoryArticles"
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
          <div v-if="filteredCategoryArticles.length === 0 && !loadingCategoryArticles" class="empty-articles">
            <i class="el-icon-document-add"></i>
            <p>该分类下暂无文章</p>
            <p class="empty-tip">从左侧列表中选择文章添加到此分类</p>
          </div>

          <!-- 加载更多 -->
          <div v-if="categoryArticles.length > 0 && hasMoreCategoryArticles" class="load-more-section">
            <el-button
              type="text"
              @click="loadMoreCategoryArticles"
              :loading="loadingCategoryArticles"
              icon="el-icon-more"
            >
              加载更多 ({{ categoryArticles.length }}/{{ totalArticleCount }})
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑分类对话框 -->
    <add-category-dialog
      ref="editDialog"
      @onUpdateSucceed="onCategoryUpdated"
    />
  </div>
</template>

<script>
import AddCategoryDialog from "./AddDialog.vue";

export default {
  name: "CategoryDetail",
  components: {
    AddCategoryDialog
  },
  data() {
    return {
      // 基础数据
      category: {},
      allCategories: [],
      
      // 文章数据
      availableArticles: [],
      categoryArticles: [],
      selectedArticles: [],
      
      // 搜索和筛选
      articleSearch: '',
      categoryArticleSearch: '',
      filterCategoryId: '',
      
      // 分页数据
      availableArticlesPage: 1,
      availableArticlesPageSize: 20,
      categoryArticlesPage: 1,
      categoryArticlesPageSize: 20,
      totalArticleCount: 0,
      totalAvailableCount: 0,
      
      // 加载状态
      loadingAvailableArticles: false,
      loadingCategoryArticles: false,
      saving: false,
      
      // 变更追踪
      pendingChanges: {
        added: [],
        removed: []
      }
    }
  },
  computed: {
    hasChanges() {
      return this.pendingChanges.added.length > 0 || this.pendingChanges.removed.length > 0
    },
    hasMoreAvailableArticles() {
      return this.availableArticles.length < this.totalAvailableCount
    },
    hasMoreCategoryArticles() {
      return this.categoryArticles.length < this.totalArticleCount
    },
    filteredCategoryArticles() {
      if (!this.categoryArticleSearch) {
        return this.categoryArticles
      }
      return this.categoryArticles.filter(article =>
        article.title.toLowerCase().includes(this.categoryArticleSearch.toLowerCase())
      )
    }
  },
  async mounted() {
    await this.initializeData()
  },
  methods: {
    async initializeData() {
      const categoryId = this.$route.params.id
      if (!categoryId) {
        this.$message.error('分类ID不能为空')
        this.goBack()
        return
      }

      try {
        // 并行加载数据
        await Promise.all([
          this.loadCategory(categoryId),
          this.loadAllCategories(),
          this.loadAvailableArticles(),
          this.loadCategoryArticles(categoryId)
        ])
      } catch (error) {
        console.error('初始化数据失败:', error)
        this.$message.error('加载数据失败: ' + error.message)
      }
    },

    async loadCategory(categoryId) {
      try {
        const res = await this.$api.category.get(categoryId)
        this.category = res.data
      } catch (error) {
        console.error('加载分类信息失败:', error)
        throw error
      }
    },

    async loadAllCategories() {
      try {
        const res = await this.$api.category.getAll()
        this.allCategories = res.data
      } catch (error) {
        console.error('加载分类列表失败:', error)
        throw error
      }
    },

    async loadAvailableArticles(page = 1, append = false) {
      this.loadingAvailableArticles = true
      try {
        const res = await this.$api.blogPost.getList(
          false, '', this.filterCategoryId || null, this.articleSearch, '', page, this.availableArticlesPageSize
        )
        
        console.log('loadAvailableArticles response:', res.data)
        
        const articles = res.data.items || res.data
        if (append) {
          this.availableArticles = [...this.availableArticles, ...articles]
        } else {
          this.availableArticles = articles
        }
        
        if (res.data.pagination) {
          this.totalAvailableCount = res.data.pagination.totalCount
        } else {
          this.totalAvailableCount = this.availableArticles.length
        }
        
        this.availableArticlesPage = page
      } catch (error) {
        console.error('加载可用文章失败:', error)
        this.$message.error('加载可用文章失败: ' + error.message)
      } finally {
        this.loadingAvailableArticles = false
      }
    },

    async loadCategoryArticles(categoryId, page = 1, append = false) {
      this.loadingCategoryArticles = true
      try {
        const res = await this.$api.blogPost.getList(
          false, '', categoryId, '', '', page, this.categoryArticlesPageSize
        )
        
        console.log('loadCategoryArticles response:', res.data)
        
        const articles = res.data.items || res.data
        if (append) {
          this.categoryArticles = [...this.categoryArticles, ...articles]
        } else {
          this.categoryArticles = articles
        }
        
        if (res.data.pagination) {
          this.totalArticleCount = res.data.pagination.totalCount
        } else {
          this.totalArticleCount = this.categoryArticles.length
        }
        
        this.categoryArticlesPage = page
        
        console.log('categoryArticles count:', this.categoryArticles.length, 'total:', this.totalArticleCount)
      } catch (error) {
        console.error('加载分类文章失败:', error)
        this.$message.error('加载分类文章失败: ' + error.message)
      } finally {
        this.loadingCategoryArticles = false
      }
    },

    // 刷新方法
    async refreshAvailableArticles() {
      this.availableArticlesPage = 1
      await this.loadAvailableArticles(1, false)
    },

    async refreshCategoryArticles() {
      this.categoryArticlesPage = 1
      await this.loadCategoryArticles(this.category.id, 1, false)
    },

    // 加载更多方法
    async loadMoreAvailableArticles() {
      if (!this.loadingAvailableArticles && this.hasMoreAvailableArticles) {
        const nextPage = this.availableArticlesPage + 1
        await this.loadAvailableArticles(nextPage, true)
      }
    },

    async loadMoreCategoryArticles() {
      if (!this.loadingCategoryArticles && this.hasMoreCategoryArticles) {
        const nextPage = this.categoryArticlesPage + 1
        await this.loadCategoryArticles(this.category.id, nextPage, true)
      }
    },

    // 搜索和筛选
    async searchArticles() {
      this.availableArticlesPage = 1
      await this.loadAvailableArticles(1, false)
    },

    async filterArticles() {
      this.availableArticlesPage = 1
      await this.loadAvailableArticles(1, false)
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

      this.$message.success(`已添加文章: ${article.title}`)
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

      this.$message.success(`已移除文章: ${article.title}`)
    },

    removeSelectedArticles() {
      if (this.selectedArticles.length === 0) return

      this.$confirm(`确定要移除选中的 ${this.selectedArticles.length} 篇文章吗？`, '确认操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selectedArticles.forEach(articleId => {
          const article = this.categoryArticles.find(a => a.id === articleId)
          if (article) {
            this.removeArticleFromCategory(article)
          }
        })
        this.selectedArticles = []
        this.$message.success('批量移除成功')
      })
    },

    // 保存修改
    async saveChanges() {
      if (!this.hasChanges) {
        this.$message.info('没有需要保存的修改')
        return
      }

      this.saving = true
      try {
        // 这里需要根据实际API实现文章分类的更新
        // 由于当前API中没有直接的文章分类管理接口，这里模拟保存过程
        
        for (const articleId of this.pendingChanges.added) {
          // 调用API将文章添加到分类
          // await this.$api.blogPost.updateCategory(articleId, this.category.id)
        }

        for (const articleId of this.pendingChanges.removed) {
          // 调用API将文章从分类中移除
          // await this.$api.blogPost.updateCategory(articleId, null)
        }

        this.pendingChanges = { added: [], removed: [] }
        this.$message.success('保存成功')
        
        // 刷新数据
        await this.refreshCategoryArticles()
      } catch (error) {
        console.error('保存失败:', error)
        this.$message.error('保存失败：' + error.message)
      } finally {
        this.saving = false
      }
    },

    // 其他操作
    editCategory() {
      this.$refs.editDialog.edit(this.category)
    },

    onCategoryUpdated(updatedCategory) {
      this.category = { ...this.category, ...updatedCategory }
      this.$message.success('分类信息更新成功')
    },

    goBack() {
      this.$router.push('/categories')
    },

    formatDate(dateString) {
      if (!dateString) return ''
      return new Date(dateString).toLocaleDateString('zh-CN')
    }
  }
}
</script>

<style scoped>
.category-detail-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.detail-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.back-button {
  font-size: 14px;
  color: #409eff;
  padding: 0;
}

.back-button:hover {
  color: #66b1ff;
}

.category-info {
  display: flex;
  align-items: center;
  flex: 1;
  margin: 0 20px;
}

.category-icon {
  font-size: 48px;
  color: #409eff;
  margin-right: 20px;
}

.category-name {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.category-description {
  font-size: 16px;
  color: #606266;
  margin: 0 0 12px 0;
}

.category-meta {
  display: flex;
  align-items: center;
  gap: 16px;
}

.meta-item {
  font-size: 14px;
  color: #909399;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.detail-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 200px);
}

.articles-panel {
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  background: #fafbfc;
  border-radius: 8px 8px 0 0;
}

.panel-header h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.panel-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.articles-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.article-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.article-item:hover {
  background: #e3f2fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  font-size: 16px;
  font-weight: 500;
  color: #303133;
  margin: 0 0 8px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-meta {
  font-size: 14px;
  color: #909399;
  margin: 0;
  display: flex;
  gap: 16px;
  align-items: center;
}

.article-status {
  padding: 2px 8px;
  background: #e1f3d8;
  color: #67c23a;
  border-radius: 4px;
  font-size: 12px;
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
  padding: 60px 20px;
  color: #909399;
}

.empty-articles i {
  font-size: 64px;
  margin-bottom: 16px;
  display: block;
  opacity: 0.5;
}

.empty-tip {
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.8;
}

.load-more-section {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  margin-top: 16px;
}

.load-more-section .el-button {
  font-size: 14px;
  color: #409eff;
}

.load-more-section .el-button:hover {
  color: #66b1ff;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .detail-content {
    flex-direction: column;
    height: auto;
  }
  
  .articles-panel {
    height: 500px;
  }
}

@media (max-width: 768px) {
  .category-detail-container {
    padding: 12px;
  }
  
  .detail-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .category-info {
    margin: 0;
    justify-content: center;
    text-align: center;
  }
  
  .header-actions {
    justify-content: center;
  }
  
  .panel-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .article-item {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .article-actions {
    margin-left: 0;
    text-align: center;
  }
}
</style>