<template>
  <el-table
    :data="tableData"
    :height="600"
    stripe
    style="width: 100%;">
    <el-table-column
      prop="id"
      label="ID"
      width="50">
    </el-table-column>
    <el-table-column
      prop="name"
      label="推荐名称"
      width="250">
    </el-table-column>
    <el-table-column
      prop="description"
      label="推荐说明"
      width="500"
      :show-overflow-tooltip="true">
    </el-table-column>
    <el-table-column
      prop="iconCssClass"
      label="图标"
      width="200">
    </el-table-column>
    <el-table-column
      prop="category.id"
      label="分类ID"
      width="80">
    </el-table-column>
    <el-table-column
      prop="category.name"
      label="分类名称">
    </el-table-column>
    <el-table-column
      align="right">
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
  name: "FeaturedCategories",
  data() {
    return {
      data: [],
      search: ''
    }
  },
  mounted() {
    this.loadData()
  },
  computed: {
    tableData() {
      return this.data.filter(item =>
        !this.search || item.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  methods: {
    loadData() {
      this.$api.featuredCategory.getAll()
        .then(res => this.data = res.data)
    },
    cancelFeatured(index, item) {
      this.$confirm('你确定吗?', 'Are you sure?', {type: 'warning'})
        .then(() => {
          this.$api.featuredCategory.deleteItem(item.id)
            .then(res => this.$message.success(`操作成功。${res.message}`))
            .catch(res => this.$message.error(`操作失败。${res.message}`))
            .finally(() => this.loadData())
        })
        .catch(() => this.$message('操作取消'))
    }
  }
}
</script>

<style scoped>

</style>
