<template>
  <div class="categories-tree-container">
    <!-- 左侧面板 -->
    <div class="left-panel" :style="{ width: leftPanelWidth + '%' }">
      <CategoryTreePanel
        :tree-data="treeData"
        :loading="loading"
        :selected-category="selectedCategory"
        @node-click="handleNodeClick"
        @menu-command="handleMenuCommand"
        @add-category="handleAdd"
      />
    </div>

    <!-- 分割线 -->
    <ResizableDivider
      :is-resizing="isResizing"
      @start-resize="startResize"
    />

    <!-- 右侧面板 -->
    <div class="right-panel" :style="{ width: (100 - leftPanelWidth) + '%' }">
      <CategoryDetailPanel
        :selected-category="selectedCategory"
        :category-posts="categoryPosts"
        :posts-loading="postsLoading"
        @create-post="createPost"
        @add-subcategory="addSubCategory"
        @edit-category="editCategory"
        @refresh-posts="loadCategoryPosts"
        @view-post="viewPost"
        @edit-post="editPost"
        @delete-post="deletePost"
      />
    </div>

    <!-- 添加分类对话框 -->
    <AddCategoryDialog
      ref="addDialog"
      @add-succeed="onAddSucceed"
      @update-succeed="onUpdateSucceed"
    />
  </div>
</template>

<script>
import AddCategoryDialog from "@/views/Category/AddDialog.vue";
import CategoryTreePanel from "./components/CategoryTreePanel.vue";
import CategoryDetailPanel from "./components/CategoryDetailPanel.vue";
import ResizableDivider from "./components/ResizableDivider.vue";

export default {
  name: "CategoriesTree",
  components: {
    AddCategoryDialog,
    CategoryTreePanel,
    CategoryDetailPanel,
    ResizableDivider
  },
  data() {
    return {
      loading: false,
      treeData: [],
      selectedCategory: null, // 当前选中的分类
      categoryPosts: [], // 当前分类的文章列表
      postsLoading: false, // 文章加载状态
      leftPanelWidth: 35, // 左侧面板宽度百分比
      isResizing: false // 是否正在调整大小
    }
  },
  watch: {
    // 移除searchText的watch，因为搜索功能已经移到子组件中
  },
  mounted() {
    this.loadData()
    // 添加鼠标事件监听器用于调整面板大小
    document.addEventListener('mousemove', this.handleResize)
    document.addEventListener('mouseup', this.stopResize)
  },
  beforeDestroy() {
    // 清理事件监听器
    document.removeEventListener('mousemove', this.handleResize)
    document.removeEventListener('mouseup', this.stopResize)
  },
  methods: {
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

    // 处理节点点击事件
    handleNodeClick(data) {
      this.selectCategory(data)
    },

    // 选择分类
    selectCategory(category) {
      this.selectedCategory = category
      this.loadCategoryPosts()
    },

    // 加载分类文章
    async loadCategoryPosts() {
      if (!this.selectedCategory) return

      this.postsLoading = true
      try {
        const res = await this.$api.category.getPosts(
          this.selectedCategory.id, // categoryId
          1, // page
          50 // pageSize
        )
        console.log('加载分类文章成功:', res.data);
        this.categoryPosts = res.data || []
      } catch (error) {
        console.error('加载分类文章失败:', error)
        this.$message.error('加载分类文章失败')
        this.categoryPosts = []
      } finally {
        this.postsLoading = false
      }
    },

    // 面板大小调整
    startResize(e) {
      this.isResizing = true
      e.preventDefault()
    },

    handleResize(e) {
      if (!this.isResizing) return

      const container = this.$el
      const containerRect = container.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // 限制宽度范围在20%-60%之间
      if (newWidth >= 20 && newWidth <= 60) {
        this.leftPanelWidth = newWidth
      }
    },

    stopResize() {
      this.isResizing = false
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
      // 跳转到分类详情页面
      this.$router.push({
        path: `/category/detail/${category.id}`,
      })
    },

    // 查看文章详情
    viewPost(post) {
      // 跳转到文章编辑页面
      this.$router.push({
        path: `/post/edit/${post.id}`,
      })
    },

    // 编辑文章
    editPost(post) {
      this.$router.push({
        path: `/post/edit/${post.id}`,
      })
    },

    // 删除文章
    deletePost(post) {
      this.$confirm(`确定要删除文章"${post.title}"吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.$api.blogPost.deleteItem(post.id)
          this.$message.success('删除成功')
          this.loadCategoryPosts() // 重新加载文章列表
        } catch (error) {
          this.$message.error(`删除失败：${error.message}`)
        }
      }).catch(() => {
        this.$message('已取消删除')
      })
    },

    // 创建文章
    createPost() {
      this.$router.push({
        path: '/blog/add',
        query: { categoryId: this.selectedCategory && this.selectedCategory.id }
      })
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
          // 如果删除的是当前选中的分类，清空选择
          if (this.selectedCategory && this.selectedCategory.id === category.id) {
            this.selectedCategory = null
            this.categoryPosts = []
          }
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
      // 如果更新的是当前选中的分类，重新加载文章
      if (this.selectedCategory) {
        this.loadCategoryPosts()
      }
    }
  }
}
</script>

<style scoped>
.categories-tree-container {
  display: flex;
  height: 100vh;
  background: #f5f5f5;
}

/* 左侧面板样式 */
.left-panel {
  background: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  min-width: 250px;
  max-width: 500px;
}

/* 右侧面板样式 */
.right-panel {
  background: white;
  display: flex;
  flex-direction: column;
  min-width: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .categories-tree-container {
    flex-direction: column;
    height: auto;
  }

  .left-panel,
  .right-panel {
    width: 100% !important;
    min-width: auto;
  }
}
</style>
