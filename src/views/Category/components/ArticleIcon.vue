<template>
  <div class="article-icon" @click="handleClick" @dblclick="handleDblClick">
    <div class="icon-wrapper">
      <i class="el-icon-document"></i>
    </div>
    <span class="title" :title="post.title">{{ post.title }}</span>
  </div>
</template>

<script>
export default {
  name: 'ArticleIcon',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleClick() {
      // 单击事件可以用于选中，这里我们先触发一个 select 事件
      this.$emit('select', this.post);
    },
    handleDblClick() {
      // 双击事件用于查看文章
      this.$emit('view', this.post);
    }
  }
}
</script>

<style scoped>
.article-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  padding: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  text-align: center;
}

.article-icon:hover {
  background-color: #f5f7fa;
}

.article-icon.is-selected {
  background-color: #ecf5ff;
}

.icon-wrapper {
  font-size: 48px;
  color: #909399;
  margin-bottom: 12px;
}

.title {
  font-size: 13px;
  color: #303133;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  height: calc(1.4em * 2);
}
</style>