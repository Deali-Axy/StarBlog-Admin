<template>
  <el-table
    v-loading="loading"
    :data="tableData"
    style="width: 100%;">
    <el-table-column
      prop="id"
      label="ID"
      width="50">
    </el-table-column>
    <el-table-column
      prop="post.id"
      label="文章ID"
      width="150">
    </el-table-column>
    <el-table-column
      prop="post.category.name"
      label="文章分类"
      width="250">
    </el-table-column>
    <el-table-column
      prop="post.title"
      label="文章标题"
      :show-overflow-tooltip="true">
    </el-table-column>
    <el-table-column width="280" align="right">
      <template slot="header" slot-scope="scope">
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"/>
      </template>
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="warning" plain
          @click="cancelFeatured(scope.$index, scope.row)">取消推荐
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: "FeaturedPosts",
  data() {
    return {
      loading: false,
      data: [],
      search: ''
    }
  },
  computed: {
    tableData() {
      return this.data.filter(item =>
        !this.search || item.post.title.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.loading = true
      this.$api.featuredPost.getAll()
        .then(res => this.data = res.data)
        .catch(res => {
          console.error(res)
          this.$message.error(res.message)
        })
        .finally(() => this.loading = false)
    },
    cancelFeatured(index, item) {
      this.$confirm('你确定吗?', 'Are you sure?', {type: 'warning'})
        .then(() => {
          this.$api.featuredPost.deleteItem(item.id)
            .then(res => this.$message.success(`操作成功。${res.message}`))
            .catch(res => this.$message.error(`操作失败。${res.message}`))
            .finally(() => this.loadData())
        })
        .catch(() => this.$message('操作取消'))
    },
  }
}
</script>

<style scoped>

</style>
