<template>
  <el-popover
    placement="bottom"
    width="230"
    trigger="manual"
    v-model="visible">
    <p>图片名称：{{ photo.title }}</p>
    <p>拍摄地点：{{ photo.location }}</p>
    <p>上传时间：{{ dateTimeStr }}</p>
    <el-button-group>
      <el-button type="" icon="el-icon-edit"></el-button>
      <el-button type="warning" icon="el-icon-check" @click="setFeatured"></el-button>
      <el-button type="info" icon="el-icon-close" @click="cancelFeatured"></el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deletePhoto"></el-button>
    </el-button-group>
    <el-card slot="reference" :body-style="{ padding: '0px' }" style="margin: 5px;">
      <!--  去掉浏览器默认事件，添加自定义事件   -->
      <el-image :src="photo.url" class="image" :preview-src-list="[photo.url]"
                @contextmenu.prevent="onImageRightClick"></el-image>
    </el-card>
  </el-popover>
</template>

<script>
export default {
  name: "PhotoCard",
  props: {
    photo: {
      type: Object
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    dateTimeStr() {
      let dt = new Date(this.photo.createTime)
      return `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`
    }
  },
  methods: {
    onImageRightClick() {
      this.visible = !this.visible
    },
    setFeatured() {
      this.$api.photo.setFeatured(this.photo.id)
        .then(res => this.$message.success('设置推荐成功'))
        .catch(res => this.$message.error(`操作失败。${res.message}`))
      this.onImageRightClick()
    },
    cancelFeatured() {
      this.$api.photo.cancelFeatured(this.photo.id)
        .then(res => this.$message.success('取消推荐成功'))
        .catch(res => this.$message.error(`操作失败。${res.message}`))
      this.onImageRightClick()
    },
    deletePhoto() {
      this.$confirm('此操作将永久删除该图片, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api.photo.deleteItem(this.photo.id)
          .then(res => {
            this.$message.success(`删除成功。${res.message}`)
            // 删除完成，触发已删除事件
            this.$emit('onItemDeleted')
          })
          .catch(res => this.$message.error(`操作失败。${res.message}`))
      }).catch(() => this.$message('已取消删除'))
      this.onImageRightClick()
    }
  }
}
</script>

<style scoped>

</style>
