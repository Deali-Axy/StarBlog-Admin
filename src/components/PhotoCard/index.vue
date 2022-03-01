<template>
  <el-popover
    placement="bottom"
    width="200"
    trigger="manual"
    v-model="visible">
    <p>图片名称：{{ photo.title }}</p>
    <p>拍摄地点：{{ photo.location }}</p>
    <el-button-group>
      <el-button type="" icon="el-icon-edit"></el-button>
      <el-button type="" icon="el-icon-share"></el-button>
      <el-button type="" icon="el-icon-delete"></el-button>
    </el-button-group>
    <el-card slot="reference" :body-style="{ padding: '0px' }" style="margin: 5px;">
      <!--  去掉浏览器默认事件，添加自定义事件    -->
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
      visible: false
    }
  },
  methods: {
    onImageRightClick() {
      this.visible = !this.visible
    },
  }
}
</script>

<style scoped>

</style>
