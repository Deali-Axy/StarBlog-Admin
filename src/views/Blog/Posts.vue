<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="space-between">
        <el-row :gutter="10">
          <el-col :span="7">
            <el-input v-model="search"
                      placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="7">
            <!-- 分类筛选 -->
            <!-- 为el-select添加filterable属性即可启用搜索功能。默认情况下，Select 会找出所有label属性包含输入值的选项。 -->
            <el-select v-model="currentCategoryName" clearable filterable placeholder="请选择分类" v-on:change="handleCategoryChange">
              <el-option
                v-for="item in categories"
                :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-col>
          <el-col :span="7">
            <el-select v-model="currentStatus" clearable filterable placeholder="请选择文章状态">
              <el-option
                v-for="item in statusList"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button @click="handleSearchClick">搜索</el-button>
          </el-col>
        </el-row>
        <div>
          <el-button @click="addPost">添加</el-button>
          <el-button type="danger" :disabled="!hasSelection">删除</el-button>
          <el-button @click="toggleSelection()" :disabled="!hasSelection">取消选择</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <!-- 只要在el-table元素中定义了height属性，即可实现固定表头的表格，而不需要额外的代码。 -->
      <el-table
        ref="table"
        :data="posts"
        height="730"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :default-sort="{prop: 'lastUpdateTime',order:'descending'}">
        <el-table-column
          type="selection"
          width="30"/>
        <el-table-column
          prop="id"
          label="ID"
          width="180"/>
        <el-table-column
          prop="status"
          label="文章状态"
          width="100"/>
        <el-table-column
          prop="title"
          label="标题"
          sortable
          :show-overflow-tooltip="true"
          width="600"/>
        <el-table-column
          prop="creationTime"
          label="创建时间"
          sortable
          width="150"/>
        <el-table-column
          prop="lastUpdateTime"
          label="上次更新"
          sortable
          width="150"/>
        <el-table-column
          prop="category.name"
          label="分类"/>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-link type="info" @click="onItemEditClick(scope.row)">编辑</el-link>
            <el-link type="danger" @click="onItemDeleteClick(scope.row)">删除</el-link>
            <el-dropdown @command="cmd=>onItemDropdownClick(scope.row,cmd)">
              <el-button type="text" size="small">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="setFeatured">设置推荐</el-dropdown-item>
                <el-dropdown-item command="cancelFeatured">取消推荐</el-dropdown-item>
                <el-dropdown-item command="setTop">设置置顶</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
    <el-footer height="30px">
      <!-- 分页 -->
      <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 60, 80, 100]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-footer>
  </el-container>
</template>

<script>
import * as utils from '@/utils/dateTime'
export default {
  name: 'Posts',
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      search: '',
      sortBy: null,
      posts: [],
      categories: [],
      statusList: [],
      currentCategoryId: 0,
      currentCategoryName: '',
      currentStatus: '',
      selectedPosts: [],
      hasSelection: false
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
    // 加载分类
    loadCategories() {
      this.$api.category.getAll().then(res => {
        let categories = [{id: 0, name: '全部'}]
        categories = categories.concat(res.data)
        this.categories = categories
      }).catch(res => this.$message.error(`加载分类列表出错：${res.message}`))
    },
    // 加载博客文章
    loadBlogPosts() {
      this.$api.blogPost.getList(
        false, this.currentStatus,
        this.currentCategoryId, this.search, this.sortBy,
        this.currentPage, this.pageSize
      ).then(res => {
        console.log(res)
        this.totalCount = res.pagination.totalItemCount
        this.posts = res.data
        this.posts.forEach(item => {
          item.creationTime = utils.dateTimeBeautify(item.creationTime)
          item.lastUpdateTime = utils.dateTimeBeautify(item.lastUpdateTime)
        })
      }).catch(res => this.$message.error(`获取文章列表出错：${res.message}`))
    },
    // 加载文章状态列表
    loadStatusList() {
      this.$api.blog.getStatusList().then(res => {
        this.statusList = res.data
      }).catch(res => this.$message.error(`加载状态列表出错：${res.message}`))
    },
    // 添加文章按钮
    addPost() {
      this.$router.push('/post/new')
    },
    // 查看按钮
    onItemEditClick(post) {
      this.$router.push(`/post/edit/${post.id}`)
    },
    // 删除按钮
    onItemDeleteClick(post) {
      this.$confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.blogPost.deleteItem(post.id)
          .then(res => this.$message.success(`删除成功。${res.message}`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
          .finally(() => this.loadBlogPosts())
      }).catch(() => this.$message('已取消删除'))
    },
    // 下拉菜单点击
    onItemDropdownClick(post, command) {
      switch (command) {
        case 'setFeatured':
          this.$api.blogPost.setFeatured(post.id)
            .then(res => this.$message.success('设置推荐成功'))
            .catch(res => this.$message.error(`操作失败。${res.message}`))
          break
        case 'cancelFeatured':
          this.$api.blogPost.cancelFeatured(post.id)
            .then(res => this.$message.success('取消推荐成功'))
            .catch(res => this.$message.error(`操作失败。${res.message}`))
          break
        case 'setTop':
          this.$api.blogPost.setTop(post.id)
            .then(res => this.$message.success(`设置置顶成功。${res.message}`))
            .catch(res => this.$message.error(`设置置顶失败。${res.message}`))
          break
      }
    },
    handleCategoryChange(categoryId) {
      this.currentCategoryId = categoryId
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadBlogPosts()
    },
    handleCurrentPageChange(page) {
      this.currentPage = page
      this.loadBlogPosts()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.selectedPosts = val
      this.hasSelection = this.selectedPosts.length > 0
    },
    handleSearchClick() {
      this.loadBlogPosts()
    },
  }
}
</script>

<style>
.el-header {
  text-align: left;
}
</style>
