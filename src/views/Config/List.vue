<template>
  <div>
    <add-config-dialog ref="addConfigDialog" @onAddSucceed="onAddSucceed"
                       @onUpdateSucceed="onUpdateSucceed"></add-config-dialog>
    <el-table
      ref="table"
      :data="data"
      stripe
      style="width: 100%"
      :default-sort="{prop: 'time',order:'descending'}">
      <el-table-column
        type="selection"
        width="30"/>
      <el-table-column
        prop="id"
        label="id"
        width="100"/>
      <el-table-column
        prop="key"
        label="key"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="value"
        label="value"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        prop="description"
        label="说明"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button size="mini" @click="handleAdd">添加配置项</el-button>
        </template>
        <template slot-scope="scope">
          <el-link type="info" @click="onItemEditClick(scope.row)">编辑</el-link>
          <el-link type="danger" @click="onItemDeleteClick(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AddConfigDialog from "@/views/Config/AddDialog"

export default {
  name: "ConfigList",
  components: {
    AddConfigDialog,
  },
  data() {
    return {
      data: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$api.config.getAll()
        .then(res => this.data = res.data)
        .catch(res => this.$message.error(`获取配置列表出错：${res.message}`))
    },
    handleAdd() {
      this.$refs.addConfigDialog.show()
    },
    onItemEditClick(item) {
      this.$refs.addConfigDialog.edit(item)
    },
    onItemDeleteClick(item) {
      this.$confirm('此操作将删除该配置项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.config.deleteItem(item.key)
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
  }
}
</script>

<style scoped>

</style>
