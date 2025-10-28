<template>
  <div class="category-tree-panel">
    <div class="panel-header">
      <h2 class="panel-title">分类管理</h2>
      <el-button type="primary" size="small" @click="handleAdd">
        <i class="el-icon-plus"></i> 添加分类
      </el-button>
    </div>

    <div class="search-section">
      <el-input
        v-model="searchText"
        placeholder="搜索分类..."
        prefix-icon="el-icon-search"
        size="small"
        clearable
      />
    </div>

    <div class="tree-actions">
      <el-button-group size="mini">
        <el-button @click="expandAll">
          <i class="el-icon-arrow-down"></i> 展开全部
        </el-button>
        <el-button @click="collapseAll">
          <i class="el-icon-arrow-up"></i> 折叠全部
        </el-button>
      </el-button-group>
    </div>

    <div class="tree-container">
      <el-tree
        ref="categoryTree"
        :data="treeData"
        :props="treeProps"
        :filter-node-method="filterNode"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        v-loading="loading"
      >
        <div
          slot-scope="{ node, data }"
          class="tree-node"
          :class="{ 'is-selected': selectedNodeId === data.id }"
        >
          <div class="node-content">
            <i class="node-icon el-icon-folder" v-if="hasChildren(data)"></i>
            <i class="node-icon el-icon-price-tag" v-else></i>
            <span class="node-label">{{ node.label }}</span>
            <span class="node-count" v-if="getCategoryPostsCount(data)">({{ getCategoryPostsCount(data) }}篇)</span>
            <span class="sub-category-count" v-if="hasChildren(data)">
              ({{ getChildrenCount(data) }}个子分类)
            </span>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons">
            <el-button
              type="text"
              size="mini"
              icon="el-icon-plus"
              title="添加子分类"
              @click.stop="handleMenuCommand({ action: 'addSubCategory', data })"
            ></el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-document"
              title="查看文章"
              @click.stop="handleMenuCommand({ action: 'viewPosts', data })"
            ></el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-edit"
              title="编辑分类"
              @click.stop="handleMenuCommand({ action: 'editCategory', data })"
            ></el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              title="删除分类"
              class="danger-item"
              @click.stop="handleMenuCommand({ action: 'deleteCategory', data })"
            ></el-button>
          </div>
        </div>
      </el-tree>

      <div v-if="!loading && treeData.length === 0" class="empty-state">
        <i class="el-icon-folder-opened"></i>
        <p>暂无分类数据</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CategoryTreePanel",
  props: {
    treeData: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectedCategory: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      searchText: '',
      selectedNodeId: null,
      treeProps: {
        children: 'nodes',
        label: 'text'
      }
    }
  },
  watch: {
    searchText(val) {
      this.$refs.categoryTree.filter(val);
    },
    selectedCategory: {
      handler(newVal) {
        this.selectedNodeId = newVal ? newVal.id : null;
      },
      immediate: true
    }
  },
  methods: {
    // 节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },

    // 展开所有节点
    expandAll() {
      const tree = this.$refs.categoryTree;
      if (tree) {
        const keys = [];
        const traverse = (nodes) => {
          nodes.forEach(node => {
            keys.push(node.id);
            if (node.nodes && node.nodes.length > 0) {
              traverse(node.nodes);
            }
          });
        };
        traverse(this.treeData);
        tree.setExpandedKeys(keys);
      }
    },

    // 折叠所有节点
    collapseAll() {
      const tree = this.$refs.categoryTree;
      if (tree) {
        tree.setExpandedKeys([]);
      }
    },

    // 节点点击事件
    handleNodeClick(data) {
      this.$emit('node-click', data);
    },

    // 菜单命令处理
    handleMenuCommand(command) {
      this.$emit('menu-command', command);
    },

    // 添加分类
    handleAdd() {
      this.$emit('add-category');
    },

    // 检查节点是否有子节点
    hasChildren(data) {
      return data.nodes && data.nodes.length > 0;
    },

    // 获取子分类数量
    getChildrenCount(data) {
      return data.nodes ? data.nodes.length : 0;
    },

    getCategoryPostsCount(data) {
      if (!data.tags || data.tags.length === 0) {
        return 0;
      }
      return data.tags[0];
    },
  }
}
</script>

<style scoped>
.category-tree-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e6e6e6;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.search-section {
  padding: 16px;
  border-bottom: 1px solid #e6e6e6;
}

.tree-actions {
  padding: 12px 16px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  gap: 8px;
}

.tree-container {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
  position: relative;
}

.el-tree {
  height: 100%;
}

/* 树节点样式 */
.tree-node {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  margin: 2px 0;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.tree-node:hover {
  background-color: #f5f7fa;
}

.tree-node.is-selected {
  background-color: #ecf5ff;
  border-left: 3px solid #409eff;
}

.node-content {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  overflow: hidden;
}

.node-icon {
  font-size: 14px;
  color: #909399;
  flex-shrink: 0;
}

.node-label {
  flex: 1;
  font-size: 14px;
  color: #303133;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.node-count {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
}

.sub-category-count {
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  margin-left: 4px;
}

/* 操作按钮样式 */
.action-buttons {
  display: flex;
  align-items: center;
  padding-left: 20px;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tree-node:hover .action-buttons {
  opacity: 1;
}

.action-buttons .el-button {
  padding: 4px;
  font-size: 14px;
}

.action-buttons .el-button.danger-item {
  color: #f56c6c;
}

.action-buttons .el-button.danger-item:hover {
  color: #f89898;
}

/* 空状态样式 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #909399;
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

/* Element UI 树组件自定义样式 */
::v-deep .el-tree {
  background: transparent;
}

::v-deep .el-tree-node {
  position: relative;
}

::v-deep .el-tree-node__content {
  padding: 0;
  height: auto;
  background: transparent;
}

::v-deep .el-tree-node__content:hover {
  background: transparent;
}

::v-deep .el-tree-node__expand-icon {
  padding: 6px;
  color: #c0c4cc;
  transition: transform 0.3s ease;
}

::v-deep .el-tree-node__expand-icon.expanded {
  transform: rotate(90deg);
}

::v-deep .el-tree-node__expand-icon.is-leaf {
  color: transparent;
  cursor: default;
}

/* 展开/折叠动画 */
::v-deep .el-tree-node__children {
  transition: all 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .panel-header {
    padding: 12px;
  }

  .search-section {
    padding: 12px;
  }

  .tree-actions {
    padding: 8px 12px;
  }

  .tree-node {
    padding: 6px 12px;
  }
}
</style>
