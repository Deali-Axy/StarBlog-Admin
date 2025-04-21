<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="space-between">
        <el-row :gutter="10">
          <el-col :span="3">
            <el-input v-model="search"
                      placeholder="请输入关键字" prefix-icon="el-icon-search"></el-input>
          </el-col>
          <el-col :span="2">
            <el-select v-model="excludeApi" clearable placeholder="过滤API">
              <el-option label="是" :value="true"/>
              <el-option label="否" :value="false"/>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="excludeIntranetIp" clearable placeholder="过滤内网">
              <el-option label="是" :value="true"/>
              <el-option label="否" :value="false"/>
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="geoFilter.country" clearable filterable placeholder="国家"
                       @change="handleCountryChange">
              <el-option
                v-for="item in geoFilterParams.country"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="geoFilter.province" clearable filterable placeholder="省份"
                       @change="handleProvinceChange">
              <el-option
                v-for="item in geoFilterParams.province"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="geoFilter.city" clearable filterable placeholder="城市">
              <el-option
                v-for="item in geoFilterParams.city"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>

          <el-col :span="2">
            <el-select v-model="userAgentFilter.os" clearable filterable placeholder="操作系统">
              <el-option
                v-for="item in userAgentFilterParams.os"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="userAgentFilter.device" clearable filterable placeholder="设备">
              <el-option
                v-for="item in userAgentFilterParams.device"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="userAgentFilter.userAgent" clearable filterable placeholder="UserAgent">
              <el-option
                v-for="item in userAgentFilterParams.userAgent"
                :key="item" :label="item" :value="item"
              />
            </el-select>
          </el-col>
          <el-col :span="2">
            <el-select v-model="userAgentFilter.isSpider" clearable placeholder="是否爬虫">
              <el-option label="是" :value="true"/>
              <el-option label="否" :value="false"/>
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
        :default-sort="{prop: 'time',order:'descending'}"
        @sort-change="handleSortChange">
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
        >
          <template v-slot="scope">
            <el-link type="text" :href="`${baseUrl}${scope.row.requestPath}`" target="_blank">
              {{ scope.row.requestPath }}
            </el-link>
          </template>
        </el-table-column>
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
          sortable
          label="响应时间"/>
        <el-table-column
          prop="ipInfo.country"
          sortable
          label="国家"/>
        <el-table-column
          prop="ipInfo.province"
          sortable
          label="省"/>
        <el-table-column
          prop="ipInfo.city"
          sortable
          label="城市"/>
        <el-table-column
          prop="ipInfo.isp"
          sortable
          label="运营商"/>
        <el-table-column
          prop="userAgentInfo.os.family"
          sortable
          label="操作系统"/>
        <el-table-column
          prop="userAgentInfo.device.family"
          sortable
          label="设备"/>
        <el-table-column
          prop="userAgentInfo.device.isSpider"
          sortable
          label="爬虫">
          <template v-slot="scope">
            <el-tag v-if="scope.row.userAgentInfo.device.isSpider">爬虫</el-tag>
            <el-tag type="info" v-else>用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="userAgentInfo.userAgent.family"
          label="UserAgent"/>
        <el-table-column
          align="right"
          label="操作">
          <template v-slot="scope">
            <el-link type="text" @click="showDetail(scope.row)">详情</el-link>
          </template>
        </el-table-column>
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
    <el-dialog :visible.sync="dialogVisible" title="访问记录详情" width="50%">
      <div v-if="selectedRecord">
        <el-row :gutter="20">
          <el-col :span="12">
            <p><strong>ID:</strong> {{ selectedRecord.id }}</p>
            <p><strong>IP:</strong> {{ selectedRecord.ip }}</p>
            <p><strong>地区代码:</strong> {{ selectedRecord.ipInfo.regionCode }}</p>
            <p><strong>国家:</strong> {{ selectedRecord.ipInfo.country }}</p>
            <p><strong>省份:</strong> {{ selectedRecord.ipInfo.province }}</p>
            <p><strong>城市:</strong> {{ selectedRecord.ipInfo.city }}</p>
            <p><strong>运营商:</strong> {{ selectedRecord.ipInfo.isp }}</p>
            <p><strong>请求地址:</strong>
              <el-link type="text" :href="`${baseUrl}${selectedRecord.requestPath}`" target="_blank">
                {{ selectedRecord.requestPath }}
              </el-link>
            </p>
            <p><strong>请求参数:</strong> {{ selectedRecord.requestQueryString || '无' }}</p>
            <p><strong>请求方法:</strong> {{ selectedRecord.requestMethod }}</p>
            <p><strong>状态码:</strong> {{ selectedRecord.statusCode }}</p>
            <p><strong>响应时间:</strong> {{ selectedRecord.responseTimeMs }} ms</p>
          </el-col>
          <el-col :span="12">
            <p><strong>User Agent:</strong> {{ selectedRecord.userAgent }}</p>
            <p><strong>操作系统:</strong> {{ selectedRecord.userAgentInfo.os.family }}
              {{ selectedRecord.userAgentInfo.os.major }}.{{
                selectedRecord.userAgentInfo.os.minor
              }}.{{ selectedRecord.userAgentInfo.os.patch }}</p>
            <p><strong>设备品牌:</strong> {{ selectedRecord.userAgentInfo.device.brand }}</p>
            <p><strong>设备型号:</strong> {{ selectedRecord.userAgentInfo.device.model }}</p>
            <p><strong>设备类型:</strong> {{ selectedRecord.userAgentInfo.device.family }}</p>
            <p><strong>浏览器:</strong> {{ selectedRecord.userAgentInfo.userAgent.family }}
              {{ selectedRecord.userAgentInfo.userAgent.major }}.{{
                selectedRecord.userAgentInfo.userAgent.minor
              }}.{{ selectedRecord.userAgentInfo.userAgent.patch }}</p>
            <p><strong>爬虫:</strong> {{ selectedRecord.userAgentInfo.device.isSpider ? '是' : '否' }}</p>
            <p><strong>访问时间:</strong> {{ selectedRecord.timeStr }}</p>
            <p><strong>来源页面:</strong> {{ selectedRecord.referrer || '无' }}</p>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
import * as utils from '@/utils/dateTime'
import {baseUrl} from "@/utils/global";


export default {
  name: "VisitRecordList",
  data() {
    return {
      baseUrl: baseUrl,
      loading: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      search: '',
      sortBy: null,
      excludeApi: null,
      excludeIntranetIp: null,
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
      userAgentFilter: {
        os: null,
        device: null,
        userAgent: null,
        isSpider: null,
      },
      userAgentFilterParams: {
        os: [],
        device: [],
        userAgent: [],
      },
      data: [],
      dialogVisible: false,
      selectedRecord: null,
    }
  },
  mounted() {
    this.loadGeoFilterParams()
    this.loadUserAgentFilterParams()
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
    loadUserAgentFilterParams: function () {
      this.$api.visitRecord.getUserAgentFilterParams()
        .then(res => {
          this.userAgentFilterParams = res.data
        })
        .catch(res => this.$message.error(`获取UserAgent信息筛选参数出错：${res.message}`))
    },
    loadVisitRecord: function () {
      this.loading = true
      this.$api.visitRecord.getList({
        excludeApi: this.excludeApi,
        excludeIntranetIp: this.excludeIntranetIp,
        country: this.geoFilter.country,
        province: this.geoFilter.province,
        os: this.userAgentFilter.os,
        device: this.userAgentFilter.device,
        userAgent: this.userAgentFilter.userAgent,
        isSpider: this.userAgentFilter.isSpider,
        city: this.geoFilter.city,
        page: this.currentPage,
        pageSize: this.pageSize,
        sortBy: this.sortBy
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
    showDetail(item) {
      this.selectedRecord = item;

      this.dialogVisible = true;
    },
    handleCountryChange: function (val) {
      this.geoFilter.province = null
      this.geoFilter.city = null
      this.geoFilter.param = 'province'
      this.loadGeoFilterParams()
    },
    handleProvinceChange: function (val) {
      this.geoFilter.city = null
      this.geoFilter.param = 'city'
      this.loadGeoFilterParams()
    },
    handleSortChange: function (column) {
      let orderProp = column.prop
      orderProp = orderProp.replaceAll('timeStr', 'time')

      if (column.order === 'ascending') {
        this.sortBy = orderProp
      } else if (column.order === 'descending') {
        this.sortBy = '-' + orderProp
      } else {
        this.sortBy = null
      }
      this.loadVisitRecord()
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
