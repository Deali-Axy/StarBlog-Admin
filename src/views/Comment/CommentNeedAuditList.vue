<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="start">
        <el-button @click="handleRefresh" :loading="isRefreshLoading">刷新</el-button>
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
          :show-overflow-tooltip="true"/>
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
          prop="createdTime"
          label="评论时间"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="content"
          label="评论内容"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="visible"
          label="是否展示"
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
            <el-popover
              placement="top"
              width="160"
              v-model="visible">
              <p>这是一段内容这是一段内容确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                <el-button type="primary" size="mini" @click="visible = false">确定</el-button>
              </div>
              <el-link slot="reference">删除</el-link>
            </el-popover>
            <el-link type="info" @click="handleAccept(scope.row)">通过</el-link>
            <el-link type="danger" @click="handleReject(scope.row)">拒绝</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>

<script>
import * as util from "util";
import {dateTimeBeautify} from "@/utils/dateTime";

export default {
  name: "CommentNeedAuditList",
  components: {
  },
  data() {
    return {
      data: [],
      isRefreshLoading: false,
      visible: false,
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      return new Promise((resolve, reject) => {
        this.$api.comment.getNeedAuditList()
          .then(res => {
            this.data = res.data
            this.data.forEach(e => {
              e.createdTime = dateTimeBeautify(e.createdTime)
              e.updatedTime = dateTimeBeautify(e.updatedTime)
            })
            resolve(res.data)
          })
          .catch(res => {
            this.$message.error(`获取列表出错：${res.message}`)
            reject(res)
          })
      })
    },
    async handleRefresh() {
      this.isRefreshLoading = true
      await this.loadData()
      this.isRefreshLoading = false
    },
    handleAccept() {

    },
    handleReject() {

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
