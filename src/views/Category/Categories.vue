<template>
  <el-row>
    <el-col :span="10">
      <el-table
        :data="tableData"
        :height="800"
        style="width: 100%;">
        <el-table-column
          prop="id"
          label="ID"
          width="50">
        </el-table-column>
        <el-table-column
          prop="name"
          label="名称"
          width="250">
        </el-table-column>
        <el-table-column
          prop="parentId"
          label="上一级分类"
          width="120">
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
            <el-button size="mini" type="success" plain @click="setFeatured(scope.$index, scope.row)">
              设置推荐
            </el-button>
            <el-button size="mini" type="warning" plain @click="cancelFeatured(scope.$index, scope.row)">
              取消推荐
            </el-button>
            <el-button v-if="scope.row.visible===true" size="mini" type="primary" plain
                       @click="setInvisible(scope.row)">
              <i class="fa fa-eye-slash fa-lg" aria-hidden="true"></i>
            </el-button>
            <el-button v-if="scope.row.visible===false" size="mini" type="danger" plain @click="setVisible(scope.row)">
              <i class="fa fa-eye fa-lg" aria-hidden="true"></i>
            </el-button>
            <set-featured-dialog :ref="`setFeaturedDialog_${scope.$index}`" :category="scope.row"></set-featured-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
import SetFeaturedDialog from "./SetFeaturedDialog"

export default {
  name: "Categories",
  components: {
    SetFeaturedDialog
  },
  data() {
    return {
      data: [],
      search: ''
    }
  },
  computed: {
    tableData() {
      return this.data.filter(item =>
        !this.search || item.name.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$api.category.getAll()
        .then(res => this.data = res.data)
    },
    setFeatured(index, item) {
      this.$refs[`setFeaturedDialog_${index}`].show()
    },
    cancelFeatured(index, item) {
      this.$confirm('你确定吗?', 'Are you sure?', {type: 'warning'})
        .then(() => {
          this.$api.category.cancelFeatured(item.id)
            .then(res => this.$message.success(`操作成功。${res.message}`))
            .catch(res => this.$message.error(`操作失败。${res.message}`))
        })
        .catch(() => this.$message('操作取消'))
    },
    setVisible(item) {
      this.$api.category.setVisible(item.id)
        .then(res => this.$message.success(`操作成功。${res.message}`))
        .catch(res => this.$message.error(`操作失败。${res.message}`))
        .finally(() => this.loadData())
    },
    setInvisible(item) {
      this.$api.category.setInvisible(item.id)
        .then(res => this.$message.success(`操作成功。${res.message}`))
        .catch(res => this.$message.error(`操作失败。${res.message}`))
        .finally(() => this.loadData())
    }
  }
}
</script>

<style scoped>

</style>
