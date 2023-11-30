<template>
  <div>
    <audit-reason-dialog ref="auditReasonDialog" @onAccept="onAccept" @onReject="onReject"/>
    <el-table
      ref="table"
      v-loading="loading"
      :data="data"
      stripe
      class="w-100"
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
        label="文章"
        :show-overflow-tooltip="true"
      >
        <template slot-scope="scope">
          <el-link :href="`${baseUrl}/Blog/Post/${scope.row.post.id}`" target="_blank">{{ scope.row.post.title }}</el-link>
        </template>
      </el-table-column>
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
          <el-tag size="medium" v-if="scope.row.visible">是</el-tag>
          <el-tag size="medium" v-else type="danger">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot="header" slot-scope="scope">
          <el-button @click="handleRefresh" :loading="isRefreshLoading" type="primary" size="mini">刷新</el-button>
        </template>
        <template slot-scope="scope">
          <el-link type="primary" @click="handleAccept(scope.row)">通过</el-link>
          <el-link type="danger" @click="handleReject(scope.row)">拒绝</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="py-3 text-center"
      @size-change="handlePageSizeChange"
      @current-change="handleCurrentPageChange"
      :current-page="pagination.pageNumber"
      :page-sizes="[10, 20, 40, 60, 80, 100]"
      :page-size="pagination.pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalItemCount">
    </el-pagination>
  </div>
</template>

<script>
import {dateTimeBeautify} from "@/utils/dateTime";
import AuditReasonDialog from '@/views/Comment/AuditReasonDialog.vue'
import {baseUrl} from '@/utils/global'


export default {
  name: "CommentNeedAuditList",
  components: {
    AuditReasonDialog,
  },
  data() {
    return {
      data: [],
      pagination: null,
      loading: false,
      isRefreshLoading: false,
      baseUrl: baseUrl
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      return new Promise((resolve, reject) => {
        this.loading = true
        this.$api.comment.getNeedAuditList()
          .then(res => {
            this.pagination = res.pagination
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
          .finally(() => this.loading = false)
      })
    },
    async handleRefresh() {
      this.isRefreshLoading = true
      await this.loadData()
      this.isRefreshLoading = false
    },
    handleAccept(item) {
      this.$refs.auditReasonDialog.accept(item.id)
    },
    onAccept(itemId, reason) {
      this.loading = true
      this.$api.comment.accept(itemId, reason)
        .then(res => {
          this.$message.success('操作成功！')
        })
        .catch(res => {
          console.error(res)
          this.$message.warning(`操作失败！${res.message}`)
        })
        .finally(() => this.loadData())
    },

    handleReject(item) {
      this.$refs.auditReasonDialog.reject(item.id)
    },
    onReject(itemId, reason) {
      this.loading = true
      this.$api.comment.reject(itemId, reason)
        .then(res => {
          this.$message.info('操作成功！')
        })
        .catch(res => {
          console.error(res)
          this.$message.warning(`操作失败！${res.message}`)
        })
        .finally(() => this.loadData())
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
    handlePageSizeChange(pageSize) {
      this.pagination.pageSize = pageSize
      this.loadData()
    },
    handleCurrentPageChange(page) {
      this.pagination.pageNumber = page
      this.loadData()
    },
  }
}
</script>

<style scoped>

</style>
