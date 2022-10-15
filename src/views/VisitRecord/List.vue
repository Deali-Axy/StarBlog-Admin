<template>
  <el-container>
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
          prop="ip"
          label="IP地址"
          width="100"/>
        <el-table-column
          prop="requestPath"
          label="请求地址"
          sortable
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="requestQueryString"
          label="query参数"
          width="300"
        />
        <el-table-column
          prop="requestMethod"
          label="HTTP方法"
          sortable
          width="150"/>
        <el-table-column
          prop="userAgent"
          label="UA信息"
          sortable
          :show-overflow-tooltip="true"
          width="600"/>
        <el-table-column
          prop="timeStr"
          label="时间"
          sortable
          width="200"/>
      </el-table>
    </el-main>
    <el-footer>
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
    </el-footer>
  </el-container>
</template>

<script>
import * as utils from '@/utils/dateTime'

export default {
  name: "VisitRecordList",
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      search: '',
      sortBy: null,
      data: []
    }
  },
  mounted() {
    this.loadVisitRecord()
  },
  methods: {
    loadVisitRecord: function () {
      this.$api.visitRecord.getList(this.currentPage, this.pageSize)
        .then(res => {
          console.log(res)
          this.totalCount = res.pagination.totalItemCount
          this.data = res.data
          this.data.forEach(item => {
            item.timeStr = utils.dateTimeBeautify(item.time)
          })
        })
        .catch(res => this.$message.error(`获取访问记录列表出错：${res.message}`))
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadVisitRecord()
    },
    handleCurrentPageChange(page) {
      this.currentPage = page
      this.loadVisitRecord()
    },
  }
}
</script>

<style scoped>

</style>
