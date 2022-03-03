<template>
  <el-row v-if="featuredPhotos.length>0" :gutter="10">
    <el-col :span="4" v-for="fp in featuredPhotos" :key="fp.id">
      <el-card :body-style="{ padding: '0px' }">
        <el-image :src="fp.photo.url" class="image" alt="" :preview-src-list="[fp.photo.url]"></el-image>
        <div style="padding: 14px;">
          <div>图片标题：{{ fp.photo.title }}</div>
          <div>拍摄地点：{{ fp.photo.location }}</div>
          <div style="margin-top: 3px;">
            <time class="time">{{ fp.photo.dateTimeStr }}</time>
          </div>
          <div class="bottom clearfix" style="margin-top: 3px;">
            <el-button-group>
              <el-button type="info" icon="el-icon-warning-outline" plain @click="notImpl"></el-button>
              <el-button type="primary" icon="el-icon-edit" plain @click="notImpl"></el-button>
              <el-button type="danger" icon="el-icon-delete" plain @click="deleteItem(fp)"></el-button>
            </el-button-group>
          </div>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-empty v-else description="推荐图片"></el-empty>
</template>

<script>
import {baseUrl} from "@/utils/global"

export default {
  name: "FeaturedPhotos",
  components: {},
  data() {
    return {
      featuredPhotos: [],
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      this.$api.featuredPhoto.getAll().then(res => {
        console.log(res)
        this.featuredPhotos = res.data
        this.featuredPhotos.forEach(item => {
          item.photo.url = `${baseUrl}/media/photography/${item.photo.id}.jpg`
          let dt = new Date(item.photo.createTime)
          item.photo.dateTimeStr = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
        })
        console.log('featuredPhotos', this.featuredPhotos)
      })
    },
    notImpl() {
      this.$message('还没实现哦~')
    },
    deleteItem(featuredPhoto) {
      this.$confirm('此操作将删除这个推荐图片, 是否继续?', '提示', {type: 'warning'})
        .then(() => {
          this.$api.featuredPhoto.deleteItem(featuredPhoto.id)
            .then(res => this.$message.success(`删除成功。${res.message}`))
            .catch(res => this.$message.error(`操作失败。${res.message}`))
            .finally(() => this.loadData())
        })
        .catch(() => this.$message('已取消删除'))
    }
  }
}
</script>

<style scoped>

</style>
