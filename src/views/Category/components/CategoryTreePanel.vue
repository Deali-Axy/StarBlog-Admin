<template>
  <div class="category-tree-panel">
    <div class="tree-header">
      <div class="header-title">
        <h2>分类管理</h2>
        <div class="header-actions">
          <el-button type="primary" size="small" @click="handleAdd">
            <i class="el-icon-plus"></i> 添加分类
          </el-button>
        </div>
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
    </div>

    <div class="tree-content">
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
          @mouseenter="showHoverMenu(data.id)"
          @mouseleave="hideHoverMenu(data.id)"
        >
          <div class="node-content">
            <span class="node-label">{{ node.label }}</span>
            <span class="node-count" v-if="data.count !== undefined">({{ data.count }})</span>
          </div>
          
          <!-- 悬停菜单 -->
          <div class="hover-menu" v-show="hoveredNodeId === data.id">
            <el-dropdown
              trigger="click"
              @command="handleMenuCommand"
              placement="bottom-end"
            >
              <el-button
                type="text"
                size="mini"
                class="menu-trigger"
                @click.stop
              >
                <i class="el-icon-more"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{ action: 'addSubCategory', data }">
                  <i class="el-icon-plus"></i> 添加子分类
                </el-dropdown-item>
                <el-dropdown-item :command="{ action: 'viewPosts', data }">
                  <i class="el-icon-document"></i> 查看文章
                </el-dropdown-item>
                <el-dropdown-item :command="{ action: 'editCategory', data }">
                  <i class="el-icon-edit"></i> 编辑分类
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ action: 'deleteCategory', data }"
                  class="danger-item"
                >
                  <i class="el-icon-delete"></i> 删除分类
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-tree>

      <div v-if="!loading && treeData.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="el-icon-folder-opened"></i>
        </div>
        <div class="empty-text">暂无分类数据</div>
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
    }
  },
  data() {
    return {
      searchText: '',
      hoveredNodeId: null,
      treeProps: {
        children: 'nodes',
        label: 'text'
      }
    }
  },
  watch: {
    searchText(val) {
      this.$refs.categoryTree.filter(val);
    }
  },
  methods: {
    // 悬停菜单控制
    showHoverMenu(nodeId) {
      this.hoveredNodeId = nodeId
    },

    hideHoverMenu(nodeId) {
      setTimeout(() => {
        if (this.hoveredNodeId === nodeId) {
          this.hoveredNodeId = null
        }
      }, 100)
    },

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
    }
  }
}
</script>

<style scoped>
.category-tree-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.tree-header {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
  flex-shrink: 0;
}

.header-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.search-section {
  margin-bottom: 16px;
}

.tree-actions {
  display: flex;
  justify-content: center;
}

.tree-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 20px 20px;
}

.tree-node {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 8px;
  position: relative;
}

.node-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.node-label {
  font-size: 14px;
  color: #606266;
}

.node-count {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.hover-menu {
  opacity: 0;
  transition: opacity 0.2s;
}

.tree-node:hover .hover-menu {
  opacity: 1;
}

.menu-trigger {
  padding: 4px 8px;
  color: #909399;
}

.menu-trigger:hover {
  color: #409eff;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
}

/* 危险操作样式 */
:deep(.el-dropdown-menu__item.danger-item) {
  color: #f56c6c;
}

:deep(.el-dropdown-menu__item.danger-item:hover) {
  background-color: #fef0f0;
  color: #f56c6c;
}
</style>