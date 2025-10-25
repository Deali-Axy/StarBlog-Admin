<template>
  <el-popover
    placement="bottom"
    width="260"
    trigger="manual"
    v-model="visible">
    <p>图片名称：{{ photo.title }}</p>
    <p>拍摄地点：{{ photo.location }}</p>
    <p>上传时间：{{ dateTimeStr }}</p>
    <el-button-group>
      <el-button type="primary" icon="el-icon-edit" @click="emitEdit"></el-button>
      <el-button type="warning" icon="el-icon-check" @click="setFeatured"></el-button>
      <el-button type="info" icon="el-icon-close" @click="cancelFeatured"></el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deletePhoto"></el-button>
    </el-button-group>
    <el-card slot="reference" :body-style="{ padding: '0px' }" class="photo-card">
      <!-- 推荐角标 -->
      <el-tag v-if="photo.isFeatured" type="warning" size="mini" class="featured-badge">推荐</el-tag>
      <!-- 选择模式复选框 -->
      <el-checkbox v-if="selectionMode" v-model="localSelected" class="select-checkbox" @change="onSelectChanged"></el-checkbox>
      <!-- 显式更多按钮 -->
      <el-button circle size="mini" icon="el-icon-more" class="more-btn" @click="togglePopover"></el-button>
      <!-- 图片：开启懒加载与预览 -->
      <el-image :src="photo.url" class="image" :preview-src-list="[photo.url]"
                :lazy="true"
                @contextmenu.prevent="onImageRightClick">
        <div slot="placeholder" class="image-placeholder">
          <el-skeleton :rows="3" animated></el-skeleton>
        </div>
      </el-image>
    </el-card>
  </el-popover>
</template>

<script>
import { dateTimeBeautify } from '@/utils/dateTime'

export default {
  name: "PhotoCard",
  props: {
    photo: {
      type: Object
    },
    selectionMode: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      visible: false,
      localSelected: this.selected,
    }
  },
  watch: {
    selected(val) {
      this.localSelected = val
    }
  },
  computed: {
    dateTimeStr() {
      return dateTimeBeautify(this.photo.createTime)
    }
  },
  methods: {
    togglePopover() {
      this.visible = !this.visible
    },
    onImageRightClick() {
      this.togglePopover()
    },
    emitEdit() {
      this.$emit('onEdit', this.photo)
      this.togglePopover()
    },
    onSelectChanged(val) {
      this.$emit('onSelectChange', { id: this.photo.id, selected: val })
    },
    setFeatured() {
      this.$api.photo.setFeatured(this.photo.id)
        .then(res => {
          this.$message.success('设置推荐成功')
          this.$emit('onFeaturedChange', { id: this.photo.id, isFeatured: true })
        })
        .catch(res => this.$message.error(`操作失败。${res.message}`))
      this.togglePopover()
    },
    cancelFeatured() {
      this.$api.photo.cancelFeatured(this.photo.id)
        .then(res => {
          this.$message.success('取消推荐成功')
          this.$emit('onFeaturedChange', { id: this.photo.id, isFeatured: false })
        })
        .catch(res => this.$message.error(`操作失败。${res.message}`))
      this.togglePopover()
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
            this.$emit('onItemDeleted')
          })
          .catch(res => this.$message.error(`操作失败。${res.message}`))
      }).catch(() => this.$message('已取消删除'))
      this.togglePopover()
    }
  }
}
</script>

<style scoped>
.photo-card {
  margin: 5px;
  position: relative;
}
.featured-badge {
  position: absolute;
  top: 6px;
  right: 36px;
  z-index: 2;
}
.select-checkbox {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 2;
}
.more-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 2;
}
.image {
  width: 100%;
  display: block;
}
.image-placeholder {
  padding: 8px;
}
</style>
