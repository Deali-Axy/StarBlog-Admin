<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="space-between">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input v-model="search"
                      placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="8">
            <el-cascader class="w-100" :options="categoriesTree" v-model="currentCategoryId" filterable clearable
                         placeholder="分类筛选"
                         :props="{
                              checkStrictly:true,
                              expandTrigger: 'hover',
                              emitPath:false,
                         }"></el-cascader>
          </el-col>
          <el-col :span="3">
            <el-select v-model="currentStatus" clearable filterable placeholder="文章标记">
              <el-option
                v-for="item in statusList"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="currentIsPublish" clearable placeholder="文章状态">
              <el-option label="全部" :value="null"/>
              <el-option label="已发布" :value="true"/>
              <el-option label="草稿" :value="false"/>
            </el-select>
          </el-col>
          <el-col :span="2">
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
        v-loading="loading"
        ref="table"
        :data="posts"
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
          :show-overflow-tooltip="true"/>
        <el-table-column
          prop="isPublish"
          label="文章状态">
          <template v-slot="scope">
            <el-tag v-if="scope.row.isPublish">已发布</el-tag>
            <el-tag type="info" v-else>草稿</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="500"
          sortable
          :show-overflow-tooltip="true">
          <template v-slot="scope">
            <el-link :href="`${baseUrl}/Blog/Post/${scope.row.id}`" target="_blank">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="文章标记"/>
        <el-table-column
          prop="creationTime"
          label="创建时间"
          sortable/>
        <el-table-column
          prop="lastUpdateTime"
          label="上次更新"
          sortable/>
        <el-table-column
          prop="category.name"
          label="分类"
          :show-overflow-tooltip="true"/>
        <el-table-column
          align="right"
          label="操作">
          <template v-slot="scope">
            <el-link type="info" @click="onItemEditClick(scope.row)">编辑</el-link>
            <el-link type="danger" @click="onItemDeleteClick(scope.row)">删除</el-link>
            <el-dropdown @command="cmd=>onItemDropdownClick(scope.row,cmd)">
              <el-button type="text" size="small">
                更多<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu v-slot="dropdown">
                <el-dropdown-item command="setFeatured">设置推荐</el-dropdown-item>
                <el-dropdown-item command="cancelFeatured">取消推荐</el-dropdown-item>
                <el-dropdown-item command="setTop">设置置顶</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="py-3 text-center"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 40, 60, 80, 100]"
        :page-size="pageSize"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </el-main>
  </el-container>
</template>

<script>
import * as utils from '@/utils/dateTime'
import {baseUrl} from "@/utils/global";

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
    // 加载博客文章
    loadBlogPosts() {
      this.loading = true
      this.$api.blogPost.getList(
        this.currentIsPublish, this.currentStatus,
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
        .finally(() => this.loading = false)
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
