<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="space-between">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input v-model="search" placeholder="请输入关键字" prefix-icon="el-icon-search" clearable
              @input="handleSearchInput" @clear="handleSearchClear">
            </el-input>
          </el-col>
          <el-col :span="8">
            <el-cascader class="w-100" :options="categoriesTree" v-model="currentCategoryId" filterable clearable
              placeholder="分类筛选" :props="{
                checkStrictly: true,
                expandTrigger: 'hover',
                emitPath: false,
              }" @change="handleCategoryChange">
            </el-cascader>
          </el-col>
          <el-col :span="3">
            <el-select v-model="currentStatus" clearable filterable placeholder="文章标记" @change="handleStatusChange">
              <el-option v-for="item in statusList" :key="item" :label="item" :value="item" />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="currentIsPublish" clearable placeholder="文章状态" @change="handlePublishStatusChange">
              <el-option label="全部" :value="null" />
              <el-option label="已发布" :value="true" />
              <el-option label="草稿" :value="false" />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-button @click="handleClearFilters" type="info" plain>清空筛选</el-button>
          </el-col>
        </el-row>
        <div>
          <el-button @click="addPost" type="primary">添加文章</el-button>
          <el-dropdown @command="handleBatchCommand" :disabled="!hasSelection">
            <el-button type="warning" :disabled="!hasSelection">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="batchDelete">批量删除</el-dropdown-item>
              <el-dropdown-item command="batchMoveCategory">批量移动分类</el-dropdown-item>
              <el-dropdown-item command="batchSetFeatured">批量设置推荐</el-dropdown-item>
              <el-dropdown-item command="batchCancelFeatured">批量取消推荐</el-dropdown-item>
              <el-dropdown-item command="batchSetTop">批量设置置顶</el-dropdown-item>
              <el-dropdown-item command="batchPublish">批量发布</el-dropdown-item>
              <el-dropdown-item command="batchUnpublish">批量设为草稿</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button @click="toggleSelection()" :disabled="!hasSelection">取消选择</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <!-- 加载骨架屏 -->
      <div v-if="loading && posts.length === 0" class="skeleton-container">
        <el-skeleton :rows="8" animated />
      </div>

      <!-- 表格 -->
      <el-table v-else v-loading="loading" ref="table" :data="posts" stripe style="width: 100%"
        height="calc(100vh - 280px)" @selection-change="handleSelectionChange"
        :default-sort="{ prop: 'lastUpdateTime', order: 'descending' }" empty-text="暂无数据">
        <el-table-column type="selection" width="50" fixed="left" />
        <el-table-column prop="id" label="ID" width="80" :show-overflow-tooltip="true" />
        <el-table-column prop="isPublish" label="状态" width="150" fixed="left">
          <template v-slot="scope">
            <el-switch v-model="scope.row.isPublish" active-text="已发布" inactive-text="草稿"
              @change="handlePublishToggle(scope.row)" :loading="scope.row.statusLoading">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="300" sortable :show-overflow-tooltip="true">
          <template v-slot="scope">
            <div class="title-cell">
              <el-link :href="`${baseUrl}/Blog/Post/${scope.row.id}`" target="_blank" class="post-title">
                {{ scope.row.title }}
              </el-link>
              <div class="post-summary" v-if="scope.row.summary">
                {{ scope.row.summary }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="标记" width="120">
          <template v-slot="scope">
            <el-tag v-if="scope.row.status" size="small" type="info">{{ scope.row.status }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column prop="viewCount" label="阅读量" width="100" sortable>
          <template v-slot="scope">
            <span>{{ scope.row.viewCount || 0 }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="创建时间" width="180" sortable>
          <template v-slot="scope">
            <div class="time-cell">
              <i class="el-icon-time"></i>
              <span>{{ formatDateTime(scope.row.creationTime) }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="category.name" label="分类" width="150" :show-overflow-tooltip="true">
          <template v-slot="scope">
            <el-tag v-if="scope.row.category" size="small">{{ scope.row.category.name }}</el-tag>
            <span v-else>未分类</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="300" fixed="right">
          <template v-slot="scope">
            <div class="action-buttons">
              <el-button type="text" size="small" @click="onItemEditClick(scope.row)">
                <i class="el-icon-edit"></i> 编辑
              </el-button>
              <el-button type="text" size="small" @click="copyPostLink(scope.row)">
                <i class="el-icon-link"></i> 复制链接
              </el-button>
              <el-dropdown @command="cmd => onItemDropdownClick(scope.row, cmd)" size="small">
                <el-button type="text" size="small">
                  更多<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="setFeatured" :disabled="scope.row.isFeatured">设置推荐</el-dropdown-item>
                  <el-dropdown-item command="cancelFeatured" :disabled="!scope.row.isFeatured">取消推荐</el-dropdown-item>
                  <el-dropdown-item command="setTop" :disabled="scope.row.isTop">设置置顶</el-dropdown-item>
                  <el-dropdown-item command="cancelTop" :disabled="!scope.row.isTop">取消置顶</el-dropdown-item>
                  <el-dropdown-item command="moveToCategory" divided>移动到分类</el-dropdown-item>
                  <el-dropdown-item command="delete">
                    <span style="color: #f56c6c;">删除文章</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination class="py-3 text-center" @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange" :current-page="currentPage" :page-sizes="[10, 20, 40, 60, 80, 100]"
        :page-size="pageSize" background layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
      </el-pagination>
    </el-main>

    <!-- 批量移动分类对话框 -->
    <el-dialog title="批量移动分类" :visible.sync="batchMoveCategoryVisible" width="500px">
      <el-form>
        <el-form-item label="目标分类">
          <el-cascader v-model="targetCategoryId" :options="categoriesTree" placeholder="请选择目标分类" :props="{
            checkStrictly: true,
            expandTrigger: 'hover',
            emitPath: false,
          }" style="width: 100%">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchMoveCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchMoveCategory" :loading="batchOperationLoading">确定</el-button>
      </div>
    </el-dialog>

    <!-- 单个文章移动分类对话框 -->
    <el-dialog title="移动到分类" :visible.sync="moveCategoryVisible" width="500px">
      <el-form>
        <el-form-item label="文章标题">
          <span>{{ currentMovingPost ? currentMovingPost.title : '' }}</span>
        </el-form-item>
        <el-form-item label="当前分类">
          <span>{{ currentMovingPost && currentMovingPost.category ? currentMovingPost.category.name : '未分类' }}</span>
        </el-form-item>
        <el-form-item label="目标分类">
          <el-cascader v-model="singleTargetCategoryId" :options="categoriesTree" placeholder="请选择目标分类" :props="{
            checkStrictly: true,
            expandTrigger: 'hover',
            emitPath: false,
          }" style="width: 100%">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="moveCategoryVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSingleMoveCategory" :loading="batchOperationLoading">确定</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import * as utils from '@/utils/dateTime'
import { baseUrl } from "@/utils/global";

export default {
  name: 'Posts',
  data() {
    return {
      baseUrl: baseUrl,
      loading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      search: '',
      sortBy: null,
      posts: [],
      categoriesTree: [],
      statusList: [],
      currentCategoryId: 0,
      currentStatus: null,
      currentIsPublish: null,
      selectedPosts: [],
      hasSelection: false,
      searchTimer: null, // 搜索防抖定时器
      batchMoveCategoryVisible: false,
      targetCategoryId: null,
      batchOperationLoading: false,
      // 单个文章移动分类相关
      moveCategoryVisible: false,
      currentMovingPost: null,
      singleTargetCategoryId: null
    }
  },
  mounted() {
    // 加载分类
    this.loadCategories()
    // 加载博客文章
    this.loadBlogPosts()
    // 加载文章状态列表
    this.loadStatusList()
  },
  methods: {
    /**
     * 加载分类树
     */
    loadCategories() {
      const mapNodes = (nodes) => {
        let items = []
        if (!nodes) return null
        for (const node of nodes) {
          items.push({
            label: `${node.text} (${node.tags[0]})`,
            value: node.id,
            children: mapNodes(node.nodes)
          })
        }
        return items
      }

      this.$api.category.getNodes()
        .then(res => this.categoriesTree = mapNodes(res.data))
        .catch(res => this.$message.error(`加载分类列表出错：${res.message}`))
    },

    /**
     * 加载博客文章列表
     */
    loadBlogPosts() {
      this.loading = true
      this.$api.blogPost.getList(
        this.currentIsPublish, this.currentStatus,
        this.currentCategoryId, this.search, this.sortBy,
        this.currentPage, this.pageSize
      ).then(res => {
        console.log(res)
        this.totalCount = res.pagination.totalItemCount
        this.posts = res.data.map(item => ({
          ...item,
          statusLoading: false // 添加状态切换加载标识
        }))
      }).catch(res => this.$message.error(`获取文章列表出错：${res.message}`))
        .finally(() => this.loading = false)
    },

    /**
     * 加载文章状态列表
     */
    loadStatusList() {
      this.$api.blog.getStatusList().then(res => {
        this.statusList = res.data
      }).catch(res => this.$message.error(`加载状态列表出错：${res.message}`))
    },

    /**
     * 格式化日期时间显示
     */
    formatDateTime(dateTime) {
      if (!dateTime) return '-'
      return utils.dateTimeBeautify(dateTime)
    },

    /**
     * 搜索输入处理（防抖）
     */
    handleSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }
      this.searchTimer = setTimeout(() => {
        this.currentPage = 1
        this.loadBlogPosts()
      }, 500)
    },

    /**
     * 搜索清空处理
     */
    handleSearchClear() {
      this.search = ''
      this.currentPage = 1
      this.loadBlogPosts()
    },

    /**
     * 分类变化处理
     */
    handleCategoryChange() {
      this.currentPage = 1
      this.loadBlogPosts()
    },

    /**
     * 状态变化处理
     */
    handleStatusChange() {
      this.currentPage = 1
      this.loadBlogPosts()
    },

    /**
     * 发布状态变化处理
     */
    handlePublishStatusChange() {
      this.currentPage = 1
      this.loadBlogPosts()
    },

    /**
     * 清空所有筛选条件
     */
    handleClearFilters() {
      this.search = ''
      this.currentCategoryId = 0
      this.currentStatus = null
      this.currentIsPublish = null
      this.currentPage = 1
      this.loadBlogPosts()
      this.$message.success('已清空所有筛选条件')
    },

    /**
     * 发布状态切换
     */
    handlePublishToggle(post) {
      const targetStatus = post.isPublish
      post.statusLoading = true

      // 这里需要根据实际API调整
      const apiCall = targetStatus ?
        this.$api.blogPost.publish(post.id) :
        this.$api.blogPost.unpublish(post.id)

      apiCall.then(() => {
        this.$message.success(`文章已${targetStatus ? '发布' : '设为草稿'}`)
      }).catch(err => {
        post.isPublish = !targetStatus // 恢复原状态
        this.$message.error(`操作失败：${err.message}`)
      }).finally(() => {
        post.statusLoading = false
      })
    },

    /**
     * 复制文章链接
     */
    copyPostLink(post) {
      const link = `${this.baseUrl}/Blog/Post/${post.id}`
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(() => {
          this.$message.success('链接已复制到剪贴板')
        })
      } else {
        // 兼容旧浏览器
        const textArea = document.createElement('textarea')
        textArea.value = link
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        this.$message.success('链接已复制到剪贴板')
      }
    },

    /**
     * 批量操作命令处理
     */
    handleBatchCommand(command) {
      if (this.selectedPosts.length === 0) {
        this.$message.warning('请先选择要操作的文章')
        return
      }

      switch (command) {
        case 'batchDelete':
          this.handleBatchDelete()
          break
        case 'batchMoveCategory':
          this.batchMoveCategoryVisible = true
          break
        case 'batchSetFeatured':
          this.handleBatchSetFeatured()
          break
        case 'batchCancelFeatured':
          this.handleBatchCancelFeatured()
          break
        case 'batchSetTop':
          this.handleBatchSetTop()
          break
        case 'batchPublish':
          this.handleBatchPublish()
          break
        case 'batchUnpublish':
          this.handleBatchUnpublish()
          break
      }
    },

    /**
     * 批量删除文章
     */
    handleBatchDelete() {
      this.$confirm(`确定要删除选中的 ${this.selectedPosts.length} 篇文章吗？此操作不可恢复！`, '批量删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchOperationLoading = true
        const deletePromises = this.selectedPosts.map(post =>
          this.$api.blogPost.deleteItem(post.id)
        )

        Promise.all(deletePromises)
          .then(() => {
            this.$message.success(`成功删除 ${this.selectedPosts.length} 篇文章`)
            this.loadBlogPosts()
            this.toggleSelection()
          })
          .catch(err => {
            this.$message.error(`批量删除失败：${err.message}`)
          })
          .finally(() => {
            this.batchOperationLoading = false
          })
      })
    },

    /**
     * 确认批量移动分类
     */
    confirmBatchMoveCategory() {
      if (!this.targetCategoryId) {
        this.$message.warning('请选择目标分类')
        return
      }

      this.batchOperationLoading = true
      const movePromises = this.selectedPosts.map(post =>
        this.$api.blogPost.update({
          ...post,
          categoryId: this.targetCategoryId
        })
      )

      Promise.all(movePromises)
        .then(() => {
          this.$message.success(`成功移动 ${this.selectedPosts.length} 篇文章到新分类`)
          this.batchMoveCategoryVisible = false
          this.targetCategoryId = null
          this.loadBlogPosts()
          this.toggleSelection()
        })
        .catch(err => {
          this.$message.error(`批量移动分类失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    },

    /**
     * 批量设置推荐
     */
    handleBatchSetFeatured() {
      this.batchOperationLoading = true
      const promises = this.selectedPosts.map(post =>
        this.$api.blogPost.setFeatured(post.id)
      )

      Promise.all(promises)
        .then(() => {
          this.$message.success(`成功设置 ${this.selectedPosts.length} 篇文章为推荐`)
          this.loadBlogPosts()
          this.toggleSelection()
        })
        .catch(err => {
          this.$message.error(`批量设置推荐失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    },

    /**
     * 批量取消推荐
     */
    handleBatchCancelFeatured() {
      this.batchOperationLoading = true
      const promises = this.selectedPosts.map(post =>
        this.$api.blogPost.cancelFeatured(post.id)
      )

      Promise.all(promises)
        .then(() => {
          this.$message.success(`成功取消 ${this.selectedPosts.length} 篇文章的推荐`)
          this.loadBlogPosts()
          this.toggleSelection()
        })
        .catch(err => {
          this.$message.error(`批量取消推荐失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    },

    /**
     * 批量设置置顶
     */
    handleBatchSetTop() {
      this.batchOperationLoading = true
      const promises = this.selectedPosts.map(post =>
        this.$api.blogPost.setTop(post.id)
      )

      Promise.all(promises)
        .then(() => {
          this.$message.success(`成功设置 ${this.selectedPosts.length} 篇文章为置顶`)
          this.loadBlogPosts()
          this.toggleSelection()
        })
        .catch(err => {
          this.$message.error(`批量设置置顶失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    },

    /**
     * 批量发布文章
     */
    handleBatchPublish() {
      this.batchOperationLoading = true
      const promises = this.selectedPosts
        .filter(post => !post.isPublish)
        .map(post => this.$api.blogPost.update({
          ...post,
          isPublish: true
        }))

      if (promises.length === 0) {
        this.$message.info('选中的文章都已经是发布状态')
        return
      }

      Promise.all(promises)
        .then(() => {
          this.$message.success(`成功发布 ${promises.length} 篇文章`)
          this.loadBlogPosts()
          this.toggleSelection()
        })
        .catch(err => {
          this.$message.error(`批量发布失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    },

    /**
     * 批量设为草稿
     */
    handleBatchUnpublish() {
      this.batchOperationLoading = true
      const promises = this.selectedPosts
        .filter(post => post.isPublish)
        .map(post => this.$api.blogPost.update({
          ...post,
          isPublish: false
        }))

      if (promises.length === 0) {
        this.$message.info('选中的文章都已经是草稿状态')
        return
      }

      Promise.all(promises)
        .then(() => {
          this.$message.success(`成功将 ${promises.length} 篇文章设为草稿`)
          this.loadBlogPosts()
          this.toggleSelection()
        })
        .catch(err => {
          this.$message.error(`批量设为草稿失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    },

    // ... existing code ...

    /**
     * 添加文章按钮
     */
    addPost() {
      this.$router.push('/post/new')
    },

    /**
     * 编辑文章
     */
    onItemEditClick(post) {
      this.$router.push(`/post/edit/${post.id}`)
    },

    /**
     * 下拉菜单点击处理
     */
    onItemDropdownClick(post, command) {
      switch (command) {
        case 'setFeatured':
          this.$api.blogPost.setFeatured(post.id)
            .then(res => {
              this.$message.success('设置推荐成功')
              this.loadBlogPosts()
            })
            .catch(res => this.$message.error(`操作失败。${res.message}`))
          break
        case 'cancelFeatured':
          this.$api.blogPost.cancelFeatured(post.id)
            .then(res => {
              this.$message.success('取消推荐成功')
              this.loadBlogPosts()
            })
            .catch(res => this.$message.error(`操作失败。${res.message}`))
          break
        case 'setTop':
          this.$api.blogPost.setTop(post.id)
            .then(res => {
              this.$message.success(`设置置顶成功。${res.message}`)
              this.loadBlogPosts()
            })
            .catch(res => this.$message.error(`设置置顶失败。${res.message}`))
          break
        case 'cancelTop':
          // 需要添加取消置顶的API
          this.$api.blogPost.cancelTop(post.id)
            .then(res => {
              this.$message.success('取消置顶成功')
              this.loadBlogPosts()
            })
            .catch(res => this.$message.error(`操作失败。${res.message}`))
          break
        case 'delete':
          this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$api.blogPost.deleteItem(post.id)
              .then(res => {
                this.$message.success(`删除成功。${res.message}`)
                this.loadBlogPosts()
              })
              .catch(res => this.$message.error(`操作失败。${res.message}`))
          }).catch(() => this.$message('已取消删除'))
          break
        case 'moveToCategory':
          this.currentMovingPost = post
          this.singleTargetCategoryId = post.categoryId || null
          this.moveCategoryVisible = true
          break
      }
    },

    /**
     * 分页大小变化处理
     */
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadBlogPosts()
    },

    /**
     * 当前页变化处理
     */
    handleCurrentPageChange(page) {
      this.currentPage = page
      this.loadBlogPosts()
    },

    /**
     * 切换选择状态
     */
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },

    /**
     * 选择变化处理
     */
    handleSelectionChange(val) {
      this.selectedPosts = val
      this.hasSelection = this.selectedPosts.length > 0
    },

    /**
     * 确认单个文章移动分类
     */
    confirmSingleMoveCategory() {
      if (!this.singleTargetCategoryId) {
        this.$message.warning('请选择目标分类')
        return
      }

      if (!this.currentMovingPost) {
        this.$message.error('未找到要移动的文章')
        return
      }

      this.batchOperationLoading = true
      this.$api.blogPost.update({
        ...this.currentMovingPost,
        categoryId: this.singleTargetCategoryId
      })
        .then(() => {
          this.$message.success('文章移动分类成功')
          this.moveCategoryVisible = false
          this.currentMovingPost = null
          this.singleTargetCategoryId = null
          this.loadBlogPosts()
        })
        .catch(err => {
          this.$message.error(`移动分类失败：${err.message}`)
        })
        .finally(() => {
          this.batchOperationLoading = false
        })
    }
  }
}
</script>

<style scoped>
.el-header {
  text-align: left;
}

.skeleton-container {
  padding: 20px;
}

.title-cell {
  line-height: 1.4;
}

.post-title {
  font-weight: 500;
  color: #409EFF;
  text-decoration: none;
}

.post-title:hover {
  color: #66b1ff;
}

.post-summary {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
  line-height: 1.3;
  max-height: 32px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.time-cell {
  display: flex;
  align-items: center;
  font-size: 13px;
}

.time-cell i {
  margin-right: 4px;
  color: #909399;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.action-buttons .el-button {
  margin: 0;
  padding: 4px 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .el-header .el-row {
    flex-direction: column;
    gap: 10px;
  }

  .el-header .el-col {
    width: 100% !important;
  }

  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}

/* 表格优化 */
.el-table {
  font-size: 14px;
}

.el-table .el-table__header th {
  background-color: #fafafa;
  color: #606266;
  font-weight: 500;
}

.el-table .el-table__row:hover {
  background-color: #f5f7fa;
}

/* 分页样式优化 */
.el-pagination {
  margin-top: 20px;
  text-align: center;
}

/* 对话框样式 */
.dialog-footer {
  text-align: right;
}

.dialog-footer .el-button {
  margin-left: 10px;
}
</style>
