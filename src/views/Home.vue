<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="4">
        <!--阅读总量-->
        <el-card v-loading="loading">
          <div slot="header">阅读总量</div>
          <h1>{{ visitRecordOverview.totalVisit }}</h1>
          <div>
            今日
            <i class="el-icon-top text-primary"></i>
            {{ visitRecordOverview.todayVisit }}
          </div>
        </el-card>
        <!--新的创作-->
        <el-card class="mt-2">
          <div slot="header">新的创作</div>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-button type="warning" plain class="w-100" @click="$router.push('/post/new')">
                <div><i class="icon-lg el-icon-tickets"></i></div>
                <div class="mt-2">博客文章</div>
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" plain class="w-100" @click="$router.push('/category/list')">
                <div><i class="icon-lg el-icon-folder"></i></div>
                <div class="mt-2">文章分类</div>
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="8" class="mt-2">
            <el-col :span="12">
              <el-button type="primary" plain class="w-100" @click="$router.push('/photo/list')">
                <div><i class="icon-lg el-icon-picture-outline"></i></div>
                <div class="mt-2">摄影作品</div>
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" plain class="w-100" @click="notImpl">
                <div><i class="icon-lg fa fa-code"></i></div>
                <div class="mt-2">代码片段</div>
              </el-button>
            </el-col>
          </el-row>
        </el-card>
        <!--快捷操作-->
        <el-card class="mt-2">
          <div slot="header">快捷操作</div>
          <div>
            <el-button type="info" plain class="w-100" @click="notImpl">批量导入文章</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100" @click="$router.push('post/upload')">上传文章</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100" @click="notImpl">批量导入图片</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100" @click="$router.push('/photo/list')">上传图片</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100" @click="notImpl">导出数据</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="8" v-loading="loading">
          <el-col :span="4">
            <el-card>
              <div slot="header">文章数量</div>
              <h1>{{ overview['postsCount'] }}</h1>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div slot="header">分类数量</div>
              <h1>{{ overview['categoriesCount'] }}</h1>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div slot="header">照片数量</div>
              <h1>{{ overview['photosCount'] }}</h1>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div slot="header">推荐文章</div>
              <h1>{{ overview['featuredPostsCount'] }}</h1>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div slot="header">推荐分类</div>
              <h1>{{ overview['featuredCategoriesCount'] }}</h1>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card>
              <div slot="header">推荐图片</div>
              <h1>{{ overview['featuredPhotosCount'] }}</h1>
            </el-card>
          </el-col>
        </el-row>
        <el-card class="mt-2" v-loading="loading">
          <div slot="header">数据趋势</div>
          <dv-charts class="mt-2" :style="'height: 550px'" :option="trendChartOption"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      overview: {},
      visitRecordOverview: {},
      trend: null,
      loadStage: 0
    }
  },
  computed: {
    trendChartOption() {
      let data = {}
      if (this.trend !== null) {
        data = {
          xAxis: {
            name: '日期',
            data: this.trend.map(item => item.date),
            nameTextStyle: {
              fill: '#333',
              fontSize: 20
            },
            axisLabel: {
              style: {
                fill: '#333',
                fontSize: 16,
                rotate: 0
              }
            }
          },
          yAxis: {
            name: '阅读量',
            data: 'value',
            nameTextStyle: {
              fill: '#333',
              fontSize: 20
            },
            axisLabel: {
              style: {
                fill: '#333',
                fontSize: 16,
                rotate: 0
              }
            }
          },
          series: [
            {
              data: this.trend.map(item => item.count),
              type: 'line',
              smooth: true,
              lineArea: {
                show: true,
                gradient: ['rgba(55, 162, 218, 0.6)', 'rgba(55, 162, 218, 0)']
              },
              label: {
                show: true,
                formatter: '{value} 次'
              },
            }
          ]
        }
      }
      return data
    },
    loading() {
      return this.loadStage < 3
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.$api.blog.overview()
        .then(res => {
          this.overview = null
          this.overview = res.data
          this.loadStage++
        })
        .catch(res => this.$message.error(`获取失败！${res.message}`))

      this.$api.visitRecord.getOverview()
        .then(res => {
          this.visitRecordOverview = null
          this.visitRecordOverview = res.data
          this.loadStage++
        })
        .catch(res => this.$message.error(`获取访问统计数据失败！${res.message}`))

      this.$api.visitRecord.getTrend(14)
        .then(res => {
          this.trend = null
          this.trend = res.data
          this.loadStage++
        })
        .catch(res => this.$message.error(`获取访问趋势数据失败！${res.message}`))
    },
    notImpl() {
      this.$message.warning('功能正在开发中…')
    }
  }
}
</script>

<style>
.icon-lg {
  font-size: 40px !important;
}
</style>
