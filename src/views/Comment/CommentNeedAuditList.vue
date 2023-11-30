<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="start">
      </el-row>
    </el-header>
    <el-main>
      <el-table
        ref="table"
        :data="data"
        height="730"
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
          prop="anonymousUser.name"
          label="用户名"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="anonymousUser.email"
          label="邮箱"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="content"
          label="评论内容"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="visible"
          label="visible"
        >
          <template slot-scope="scope">
            <el-tag size="medium" v-if="scope.row.visible">{{ scope.row.visible }}</el-tag>
            <el-tag size="medium" v-else type="danger">{{ scope.row.visible }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-link type="info" @click="onItemEditClick(scope.row)">编辑</el-link>
            <el-link type="danger" @click="onItemDeleteClick(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
export default {
  name: "CommentNeedAuditList",
  components: {},
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
      this.$api.comment.getNeedAuditList()
        .then(res => this.data = res.data)
        .catch(res => this.$message.error(`获取列表出错：${res.message}`))
    },
    onItemDeleteClick(item) {
      this.$confirm('此操作将删除该链接, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.link.deleteItem(item.id)
          .then(res => this.$message.success(`删除成功。${res.message}`))
          .catch(res => this.$message.error(`操作失败。${res.message}`))
          .finally(() => this.loadData())
      }).catch(() => this.$message('已取消删除'))
    },
  }
}
</script>

<style scoped>

</style>
