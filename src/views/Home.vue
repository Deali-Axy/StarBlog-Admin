<template>
  <div>
    <el-row :gutter="8">
      <el-col :span="4">
        <!--阅读总量-->
        <el-card>
          <div slot="header">阅读总量</div>
          <h1>10000</h1>
          <div>
            今日
            <i class="el-icon-top text-primary"></i>
            999
          </div>
        </el-card>
        <!--新的创作-->
        <el-card class="mt-2">
          <div slot="header">新的创作</div>
          <el-row :gutter="8">
            <el-col :span="12">
              <el-button type="warning" plain class="w-100">
                <div><i class="icon-lg el-icon-tickets"></i></div>
                <div class="mt-2">博客文章</div>
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" plain class="w-100">
                <div><i class="icon-lg el-icon-folder"></i></div>
                <div class="mt-2">文章分类</div>
              </el-button>
            </el-col>
          </el-row>
          <el-row :gutter="8" class="mt-2">
            <el-col :span="12">
              <el-button type="primary" plain class="w-100">
                <div><i class="icon-lg el-icon-picture-outline"></i></div>
                <div class="mt-2">摄影作品</div>
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" plain class="w-100">
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
            <el-button type="info" plain class="w-100">批量导入文章</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100">上传文章</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100">批量导入图片</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100">上传图片</el-button>
          </div>
          <div class="mt-2">
            <el-button type="info" plain class="w-100">导出数据</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-row :gutter="8">
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
        <el-card class="mt-2">
          <div slot="header">数据趋势</div>
          <dv-charts class="mt-2" :style="'height: 550px'" :option="option1"/>
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
      overview: null,
      option1: {
        xAxis: {
          name: '第一周',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
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
            data: [1200, 2230, 1900, 2100, 3500, 4200, 3985],
            type: 'line'
          }
        ]
      }
    }
  },
  mounted() {
    this.load()
  },
  methods: {
    load() {
      this.$api.blog.overview()
        .then(res => {
          this.overview = res.data
        })
        .catch(res => this.$message.error(`获取失败！${res.message}`))
    }
  }
}
</script>

<style>
.icon-lg {
  font-size: 40px;
}
</style>
