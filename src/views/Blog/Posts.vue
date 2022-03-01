<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="space-between">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-input
              placeholder="请输入关键字"
              prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="12">
            <!-- 分类筛选 -->
            <!-- 为el-select添加filterable属性即可启用搜索功能。默认情况下，Select 会找出所有label属性包含输入值的选项。 -->
            <el-select v-model="currentCategoryName" filterable placeholder="请选择分类" v-on:change="handleCategoryChange">
              <el-option
                v-for="item in categories"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
        <div>
          <el-button @click="addPost">添加</el-button>
          <el-button type="danger" :disabled="cancelSelectionBtnDisabled">删除</el-button>
          <el-button @click="toggleSelection()" :disabled="cancelSelectionBtnDisabled">取消选择</el-button>
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
          width="30">
        </el-table-column>
        <el-table-column
          prop="id"
          label="ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          sortable
          :show-overflow-tooltip="true"
          width="600">
        </el-table-column>
        <el-table-column
          prop="creationTime"
          label="创建时间"
          sortable
          width="250">
        </el-table-column>
        <el-table-column
          prop="lastUpdateTime"
          label="上次更新"
          sortable
          width="250">
        </el-table-column>
        <el-table-column
          prop="category.name"
          label="分类">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-link type="info" @click="handleClick(scope.row)">查看</el-link>
            <el-link type="danger">删除</el-link>
            <el-dropdown>
              <el-button type="text" size="small">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>设置推荐</el-dropdown-item>
                <el-dropdown-item>取消推荐</el-dropdown-item>
                <el-dropdown-item>设置置顶</el-dropdown-item>
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
export default {
  name: 'Posts',
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      posts: [],
      categories: [],
      currentCategoryId: 0,
      currentCategoryName: '',
      multipleSelection: [],
      cancelSelectionBtnDisabled: true
    }
  },
  mounted() {
    // 加载分类
    this.loadCategories()
    // 加载博客文章
    this.loadBlogPosts()
  },
  methods: {
    loadCategories() {
      this.$api.category.getAll().then(res => {
        let categories = [{id: 0, name: '全部'}]
        categories = categories.concat(res.data)
        this.categories = categories
      })
    },
    loadBlogPosts() {
      this.$api.blog.getList(this.currentCategoryId, this.currentPage, this.pageSize).then(res => {
        console.log(res)
        this.totalCount = res.pagination.totalItemCount
        this.posts = res.data
      })
    },
    addPost() {
      this.$message('还没实现')
    },
    handleClick(row) {
      console.log(row)
    },
    handleCategoryChange(categoryId) {
      console.log('categoryId', categoryId)
      this.currentCategoryId = categoryId
      this.loadBlogPosts()
    },
    handlePageSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.loadBlogPosts()
    },
    handleCurrentPageChange(page) {
      console.log(page)
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
      this.multipleSelection = val
      console.log(this.multipleSelection)
      this.cancelSelectionBtnDisabled = this.multipleSelection.length === 0
    }
  }
}
</script>

<style>
.el-header {
  text-align: left;
}
</style>
