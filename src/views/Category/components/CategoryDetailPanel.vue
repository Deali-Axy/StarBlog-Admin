<template>
  <div class="category-detail-panel">
    <!-- 未选择分类时的占位符 -->
    <div v-if="!selectedCategory" class="placeholder">
      <div class="placeholder-icon">
        <i class="el-icon-folder"></i>
      </div>
      <div class="placeholder-text">
        <h3>选择一个分类</h3>
        <p>点击左侧分类节点查看详细信息和文章列表</p>
      </div>
    </div>

    <!-- 选中分类时的详情展示 -->
    <div v-else class="category-details">
      <!-- 分类基本信息 -->
      <div class="category-info">
        <div class="info-header">
          <div class="category-title">
            <h2>{{ selectedCategory.text }}</h2>
            <div class="category-actions">
              <el-button size="small" @click="createPost">
                <i class="el-icon-plus"></i> 新建文章
              </el-button>
              <el-button size="small" @click="addSubCategory">
                <i class="el-icon-folder-add"></i> 添加子分类
              </el-button>
              <el-button size="small" @click="editCategory">
                <i class="el-icon-edit"></i> 编辑分类
              </el-button>
            </div>
          </div>
        </div>

        <div class="info-stats">
          <div class="stat-item">
            <div class="stat-label">分类ID</div>
            <div class="stat-value">{{ selectedCategory.id }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">文章数量</div>
            <div class="stat-value">{{ selectedCategory.tags[0] }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">创建时间</div>
            <div class="stat-value">{{ formatDate(selectedCategory.createTime) }}</div>
          </div>
          <div class="stat-item" v-if="selectedCategory.updateTime">
            <div class="stat-label">更新时间</div>
            <div class="stat-value">{{ formatDate(selectedCategory.updateTime) }}</div>
          </div>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="posts-section">
        <div class="section-header">
          <h3>分类文章</h3>
          <div class="section-actions">
            <el-button
              size="mini"
              icon="el-icon-s-grid"
              :type="displayMode === 'card' ? 'primary' : 'default'"
              @click="displayMode = 'card'"
            ></el-button>
            <el-button
              size="mini"
              icon="el-icon-menu"
              :type="displayMode === 'icon' ? 'primary' : 'default'"
              @click="displayMode = 'icon'"
            ></el-button>
            <el-button size="mini" @click="refreshPosts">
              <i class="el-icon-refresh"></i> 刷新
            </el-button>
          </div>
        </div>

        <div class="posts-content" v-loading="postsLoading">
          <!-- 文章列表 -->
          <div v-if="categoryPosts.length > 0">
            <!-- 卡片视图 -->
            <div v-if="displayMode === 'card'" class="posts-grid">
              <ArticleCard
                v-for="post in categoryPosts"
                :key="post.id"
                :post="post"
                @click="viewPost"
                @edit="editPost"
                @delete="deletePost"
              />
            </div>

            <!-- 图标视图 -->
            <div v-else-if="displayMode === 'icon'" class="posts-icon-grid">
              <ArticleIcon
                v-for="post in categoryPosts"
                :key="post.id"
                :post="post"
                @select="viewPost"
                @view="viewPost"
              />
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!postsLoading" class="posts-empty">
            <div class="empty-icon">
              <i class="el-icon-document"></i>
            </div>
            <div class="empty-text">
              <h4>暂无文章</h4>
              <p>该分类下还没有文章，点击上方"新建文章"开始创作</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArticleCard from './ArticleCard.vue'
import ArticleIcon from './ArticleIcon.vue'

export default {
  name: "CategoryDetailPanel",
  components: {
    ArticleCard,
    ArticleIcon
  },
  props: {
    selectedCategory: {
      type: Object,
      default: null
    },
    categoryPosts: {
      type: Array,
      default: () => []
    },
    postsLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      displayMode: 'icon' // 'card' or 'icon'
    }
  },
  methods: {
    // 格式化日期
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    // 创建文章
    createPost() {
      this.$emit('create-post');
    },

    // 添加子分类
    addSubCategory() {
      this.$emit('add-subcategory', this.selectedCategory);
    },

    // 编辑分类
    editCategory() {
      this.$emit('edit-category', this.selectedCategory);
    },

    // 刷新文章列表
    refreshPosts() {
      this.$emit('refresh-posts');
    },

    // 查看文章
    viewPost(post) {
      this.$emit('view-post', post);
    },

    // 编辑文章
    editPost(post) {
      this.$emit('edit-post', post);
    },

    deletePost(post) {
      this.$emit('delete-post', post);
    },

    handleIconSelect(post) {
      // 在图标模式下，单击图标等同于查看文章
      this.viewPost(post);
    }
  }
}
</script>

<style scoped>
.category-detail-panel {
  height: 100%;
  background: #f8f9fa;
  overflow-y: auto;
}

/* 占位符样式 */
.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #909399;
  padding: 40px;
}

.placeholder-icon {
  font-size: 64px;
  margin-bottom: 24px;
  opacity: 0.6;
}

.placeholder-text h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
  font-weight: 500;
  color: #606266;
}

.placeholder-text p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 分类详情样式 */
.category-details {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.category-info {
  background: #fff;
  border-bottom: 1px solid #ebeef5;
  padding: 24px;
  flex-shrink: 0;
}

.info-header {
  margin-bottom: 20px;
}

.category-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.category-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.info-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

/* 文章列表样式 */
.posts-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.section-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.posts-content {
  flex: 1;
  padding: 16px 24px 24px;
  overflow-y: auto;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.posts-icon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

/* 空状态样式 */
.posts-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  text-align: center;
  color: #909399;
}

.posts-empty .empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.6;
}

.posts-empty h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 500;
  color: #606266;
}

.posts-empty p {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-info {
    padding: 16px;
  }

  .category-title {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .category-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .info-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .section-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .posts-content {
    padding: 12px 16px 16px;
  }

  .placeholder {
    padding: 20px;
  }

  .placeholder-icon {
    font-size: 48px;
    margin-bottom: 16px;
  }

  .placeholder-text h3 {
    font-size: 18px;
  }
}
</style>
