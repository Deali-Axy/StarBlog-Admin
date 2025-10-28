<template>
  <div class="article-card" @click="handleClick">
    <div class="post-header">
      <h4 class="post-title">{{ post.title }}</h4>
      <div class="post-status">
        <el-tag 
          :type="post.isPublish ? 'success' : 'info'" 
          size="mini"
        >
          {{ post.isPublish ? '已发布' : '草稿' }}
        </el-tag>
      </div>
    </div>
    
    <div class="post-summary" v-if="post.summary">
      {{ post.summary }}
    </div>
    
    <div class="post-meta">
      <div class="meta-item">
        <i class="el-icon-time"></i>
        <span>{{ formatDate(post.createTime) }}</span>
      </div>
      <div class="meta-item" v-if="post.views">
        <i class="el-icon-view"></i>
        <span>{{ post.views }}</span>
      </div>
    </div>
    
    <div class="post-actions" @click.stop>
      <el-button size="mini" type="text" @click="handleEdit">
        <i class="el-icon-edit"></i> 编辑
      </el-button>
      <el-button size="mini" type="text" class="danger-text" @click="handleDelete">
        <i class="el-icon-delete"></i> 删除
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticleCard",
  props: {
    post: {
      type: Object,
      required: true
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

    // 点击卡片
    handleClick() {
      this.$emit('click', this.post);
    },

    // 编辑文章
    handleEdit() {
      this.$emit('edit', this.post);
    },

    // 删除文章
    handleDelete() {
      this.$emit('delete', this.post);
    }
  }
}
</script>

<style scoped>
.article-card {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.article-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.post-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  flex: 1;
  margin-right: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.post-status {
  flex-shrink: 0;
}

.post-summary {
  color: #606266;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  font-size: 12px;
  color: #909399;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item i {
  font-size: 12px;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid #f5f7fa;
}

.post-actions .el-button {
  padding: 4px 8px;
  font-size: 12px;
}

.danger-text {
  color: #f56c6c !important;
}

.danger-text:hover {
  color: #f78989 !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-card {
    padding: 12px;
    margin-bottom: 8px;
  }

  .post-title {
    font-size: 14px;
  }

  .post-summary {
    font-size: 13px;
    -webkit-line-clamp: 2;
  }

  .post-meta {
    font-size: 11px;
    gap: 12px;
  }

  .post-actions {
    gap: 4px;
  }
}
</style>