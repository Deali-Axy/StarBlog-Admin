<template>
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
        <add-category-dialog ref="addDialog" @onAddSucceed="onAddSucceed"
                             @onUpdateSucceed="onUpdateSucceed"/>
        <el-input
          v-model="search"
          size="mini"
          placeholder="输入关键字搜索"
          style="width: 30%"
        />
        <el-button size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd">添加分类</el-button>
      </template>
      <template slot-scope="scope">
        <el-button size="mini" plain @click="handleEdit(scope.row)">编辑</el-button>
        <el-button size="mini" type="success" plain @click="setFeatured(scope.$index, scope.row)">
          设置推荐
        </el-button>
        <el-button size="mini" type="warning" plain @click="cancelFeatured(scope.$index, scope.row)">
          取消推荐
        </el-button>
        <el-button size="mini" type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
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
</template>

<script>
import AddCategoryDialog from "@/views/Category/AddDialog.vue";
import SetFeaturedDialog from "./SetFeaturedDialog"
import AddLinkDialog from "@/views/Link/AddDialog.vue";

export default {
  name: "Categories",
  components: {
    AddLinkDialog,
    AddCategoryDialog,
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
    handleAdd() {
      this.$refs.addDialog.add()
    },
    handleEdit(item) {
      this.$refs.addDialog.edit(item)
    },
    handleDelete(item) {
      this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.category.deleteItem(item.id)
          .then(res => this.$message.success(`删除成功。${res.message}`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
          .finally(() => this.loadData())
      }).catch(() => this.$message('已取消删除'))
    },
    onAddSucceed() {
      this.$message.success('添加成功')
      this.loadData()
    },
    onUpdateSucceed() {
      this.$message.success('保存成功')
      this.loadData()
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
