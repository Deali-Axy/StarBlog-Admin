<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="space-between">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input v-model="search"
                      placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
          </el-col>

          <el-col :span="3">
            <el-select v-model="geoFilter.country" clearable filterable placeholder="国家" @change="handleCountryChange">
              <el-option
                v-for="item in geoFilterParams.country"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="geoFilter.province" clearable filterable placeholder="省份" @change="handleProvinceChange">
              <el-option
                v-for="item in geoFilterParams.province"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-select v-model="geoFilter.city" clearable filterable placeholder="城市">
              <el-option
                v-for="item in geoFilterParams.city"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>

          <el-col :span="2">
            <el-button @click="loadVisitRecord">搜索</el-button>
          </el-col>
        </el-row>
        <div>
          <el-button @click="">取消选择</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <el-table
        ref="table"
        v-loading="loading"
        :data="data"
        stripe
        style="width: 100%"
        :default-sort="{prop: 'time',order:'descending'}">
        <el-table-column
          type="selection"
          width="30"/>
        <el-table-column
          prop="timeStr"
          label="时间"
          sortable
          width="200"/>
        <el-table-column
          prop="requestPath"
          label="请求地址"
          sortable
          :show-overflow-tooltip="true"
        />
        <el-table-column
          prop="requestMethod"
          label="HTTP方法"
          sortable
          width="150"/>
        <el-table-column
          prop="statusCode"
          label="状态码"/>
        <el-table-column
          prop="responseTimeMs"
          label="响应时间"/>
        <el-table-column
          prop="country"
          label="国家"/>
        <el-table-column
          prop="province"
          label="省"/>
        <el-table-column
          prop="city"
          label="城市"/>
        <el-table-column
          prop="isp"
          label="运营商"/>
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
import {getGeoFilterParams} from "@/http/modules/visitRecord";

export default {
  name: "VisitRecordList",
  data() {
    return {
      loading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      search: '',
      sortBy: null,
      geoFilter: {
        param: 'country',
        country: null,
        province: null,
        city: null,
      },
      geoFilterParams: {
        country: [],
        province: [],
        city: [],
      },
      data: [],
    }
  },
  mounted() {
    this.loadGeoFilterParams()
    this.loadVisitRecord()
  },
  methods: {
    loadGeoFilterParams: function () {
      this.$api.visitRecord.getGeoFilterParams({...this.geoFilter})
        .then(res => {
          this.geoFilterParams[this.geoFilter.param] = res.data
        })
        .catch(res => this.$message.error(`获取地理信息筛选参数出错：${res.message}`))
    },
    loadVisitRecord: function () {
      this.loading = true
      this.$api.visitRecord.getList({
        country: this.geoFilter.country,
        province: this.geoFilter.province,
        city: this.geoFilter.city,
        page: this.currentPage,
        pageSize: this.pageSize,
      })
        .then(res => {
          console.log(res)
          this.totalCount = res.pagination.totalItemCount
          this.data = res.data
          this.data.forEach(item => {
            item.timeStr = utils.dateTimeBeautify(item.time)
          })
        })
        .catch(res => this.$message.error(`获取访问记录列表出错：${res.message}`))
        .finally(() => this.loading = false)
    },
    handleCountryChange: function(val) {
      this.geoFilter.province = null
      this.geoFilter.city = null
      this.geoFilter.param = 'province'
      this.loadGeoFilterParams()
    },
    handleProvinceChange: function(val) {
      this.geoFilter.city = null
      this.geoFilter.param = 'city'
      this.loadGeoFilterParams()
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
