<template>
  <div class="categories-tree-container">
    <!-- 头部操作栏 -->
    <div class="header-actions">
      <div class="search-section">
        <el-input
          v-model="searchText"
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
          type="default"
          icon="el-icon-s-unfold"
          @click="expandAll"
          size="medium"
        >
          展开全部
        </el-button>
        <el-button
          type="default"
          icon="el-icon-s-fold"
          @click="collapseAll"
          size="medium"
        >
          折叠全部
        </el-button>
      </div>
    </div>

    <!-- 树形分类展示 -->
    <div class="tree-container" v-loading="loading">
      <el-tree
        ref="categoryTree"
        :data="treeData"
        :props="treeProps"
        :filter-node-method="filterNode"
        :expand-on-click-node="true"
        :default-expand-all="false"
        node-key="id"
        class="category-tree"
      >
        <span class="tree-node" slot-scope="{ node, data }">
          <div class="node-content" @mouseenter="showHoverMenu(data.id)" @mouseleave="hideHoverMenu(data.id)">
            <div class="node-info">
              <i class="el-icon-folder-opened node-icon"></i>
              <span class="node-label">
                {{ data.text }}
                <span v-if="data.nodes && data.nodes.length > 0" class="sub-category-count">
                  （{{ data.nodes.length }}个子分类）
                </span>
              </span>
              <el-tag 
                v-if="data.tags && data.tags.length > 0" 
                size="mini" 
                type="info"
                class="post-count-tag"
              >
                {{ data.tags[0] }}篇
              </el-tag>
            </div>
            
            <!-- 悬停操作菜单 -->
            <div class="hover-menu" :class="{ 'show': hoveredNodeId === data.id }">
              <el-dropdown 
                trigger="click" 
                placement="bottom-end"
                @command="handleMenuCommand"
                :hide-on-click="true"
              >
                <el-button 
                  size="mini" 
                  type="text" 
                  icon="el-icon-more"
                  class="menu-trigger"
                  @click.stop
                >
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item 
                    :command="{ action: 'addSubCategory', data: data }"
                    icon="el-icon-plus"
                  >
                    添加子分类
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="{ action: 'viewPosts', data: data }"
                    icon="el-icon-document"
                  >
                    查看文章
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="{ action: 'editCategory', data: data }"
                    icon="el-icon-edit"
                  >
                    编辑分类
                  </el-dropdown-item>
                  <el-dropdown-item 
                    :command="{ action: 'deleteCategory', data: data }"
                    icon="el-icon-delete"
                    class="danger-item"
                    divided
                  >
                    删除分类
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </span>
      </el-tree>

      <!-- 空状态 -->
      <div v-if="treeData.length === 0 && !loading" class="empty-state">
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
  </div>
</template>

<script>
import AddCategoryDialog from "@/views/Category/AddDialog.vue";

export default {
  name: "CategoriesTree",
  components: {
    AddCategoryDialog
  },
  data() {
    return {
      loading: false,
      treeData: [],
      searchText: '',
      hoveredNodeId: null, // 当前悬停的节点ID
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
  mounted() {
    this.loadData()
  },
  methods: {
    // 悬停菜单控制
    showHoverMenu(nodeId) {
      this.hoveredNodeId = nodeId
    },

    hideHoverMenu(nodeId) {
      // 延迟隐藏，避免鼠标移动到菜单时闪烁
      setTimeout(() => {
        if (this.hoveredNodeId === nodeId) {
          this.hoveredNodeId = null
        }
      }, 100)
    },

    // 处理菜单命令
    handleMenuCommand(command) {
      const { action, data } = command
      switch (action) {
        case 'addSubCategory':
          this.addSubCategory(data)
          break
        case 'viewPosts':
          this.viewCategoryPosts(data)
          break
        case 'editCategory':
          this.editCategory(data)
          break
        case 'deleteCategory':
          this.deleteCategory(data)
          break
      }
    },

    // 数据加载
    async loadData() {
      this.loading = true
      try {
        const res = await this.$api.category.getNodes()
        this.treeData = res.data || []
      } catch (error) {
        console.error(error)
        this.$message.error(error.message || '加载分类数据失败')
      } finally {
        this.loading = false
      }
    },

    // 树形搜索过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.text.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },

    // 展开全部节点
    expandAll() {
      const allKeys = this.getAllNodeKeys(this.treeData)
      this.$refs.categoryTree.setExpandedKeys(allKeys)
    },

    // 折叠全部节点
    collapseAll() {
      this.$refs.categoryTree.setExpandedKeys([])
    },

    // 获取所有节点的key
    getAllNodeKeys(nodes) {
      let keys = []
      nodes.forEach(node => {
        keys.push(node.id)
        if (node.nodes && node.nodes.length > 0) {
          keys = keys.concat(this.getAllNodeKeys(node.nodes))
        }
      })
      return keys
    },

    // 查看分类文章
    viewCategoryPosts(category) {
      // 根据href跳转到文章列表页面
      if (category.href) {
        // 这里可以根据实际路由配置进行跳转
        this.$router.push({
          path: '/blog/list',
          query: { categoryId: category.id }
        })
      }
    },

    // 添加分类
    handleAdd() {
      this.$refs.addDialog.add()
    },

    // 添加子分类
    addSubCategory(parentCategory) {
      // 调用对话框的addSubCategory方法，传入父分类信息
      this.$refs.addDialog.addSubCategory({
        id: parentCategory.id,
        name: parentCategory.text
      })
    },

    // 编辑分类
    editCategory(category) {
      // 将树形数据转换为编辑所需的格式
      const editData = {
        id: category.id,
        name: category.text,
        // 这里可能需要根据实际API调用获取更多详细信息
      }
      this.$refs.addDialog.edit(editData)
    },

    // 删除分类
    deleteCategory(category) {
      this.$confirm(`此操作将删除分类"${category.text}"，是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await this.$api.category.deleteItem(category.id)
          this.$message.success(`删除成功。${res.message || ''}`)
          this.loadData()
        } catch (error) {
          this.$message.error(`操作失败。${error.message}`)
        }
      }).catch(() => {
        this.$message('已取消删除')
      })
    },

    // 添加成功回调
    onAddSucceed() {
      this.$message.success('添加成功')
      this.loadData()
    },

    // 更新成功回调
    onUpdateSucceed() {
      this.$message.success('保存成功')
      this.loadData()
    }
  }
}
</script>

<style scoped>
.categories-tree-container {
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

/* 树形容器 */
.tree-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-height: 400px;
}

/* 树形组件样式 */
.category-tree {
  font-size: 14px;
}

.category-tree .el-tree-node__content {
  height: auto;
  padding: 8px 0;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 4px 0;
}

.node-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.node-icon {
  color: #409eff;
  margin-right: 8px;
  font-size: 16px;
}

.node-label {
  font-weight: 500;
  color: #303133;
  margin-right: 12px;
}

.sub-category-count {
  font-weight: 400;
  color: #909399;
  font-size: 12px;
  margin-left: 4px;
}

.post-count-tag {
  margin-left: 8px;
}

/* 悬停菜单样式 */
.hover-menu {
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  transform: translateX(10px);
}

.hover-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateX(0);
}

.menu-trigger {
  padding: 4px 8px !important;
  font-size: 16px !important;
  color: #909399 !important;
  border-radius: 4px;
}

.menu-trigger:hover {
  color: #409eff !important;
  background-color: #ecf5ff !important;
}

/* 下拉菜单项样式 */
.el-dropdown-menu__item.danger-item {
  color: #f56c6c;
}

.el-dropdown-menu__item.danger-item:hover {
  background-color: #fef0f0;
  color: #f56c6c;
}

.node-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tree-node:hover .node-actions {
  opacity: 1;
}

.node-actions .el-button {
  padding: 2px 6px;
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
  text-align: center;
  padding: 60px 20px;
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
  .header-actions {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: center;
    flex-wrap: wrap;
  }

  .node-actions {
    opacity: 1;
  }

  .node-actions .el-button {
    padding: 1px 4px;
  }
}

@media (max-width: 480px) {
  .categories-tree-container {
    padding: 12px;
  }

  .tree-container {
    padding: 12px;
  }

  .node-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .node-actions {
    width: 100%;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}

/* 自定义树形组件样式 */
.category-tree >>> .el-tree-node__expand-icon {
  color: #409eff;
}

.category-tree >>> .el-tree-node__expand-icon.expanded {
  transform: rotate(90deg);
}

/* 隐藏没有子节点的展开图标 */
.category-tree >>> .el-tree-node.is-leaf > .el-tree-node__content > .el-tree-node__expand-icon {
  visibility: hidden;
}

.category-tree >>> .el-tree-node:focus > .el-tree-node__content {
  background-color: #f5f7fa;
}

.category-tree >>> .el-tree-node__content:hover {
  background-color: #f5f7fa;
}
</style>