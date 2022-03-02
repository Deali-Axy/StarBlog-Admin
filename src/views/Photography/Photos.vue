<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="start">
        <div>
          <el-button @click="$refs.addPhotoDialog.show()">添加</el-button>
          <el-button type="danger">批量删除</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <Waterfall align="center"
                 :line-gap="300" :min-line-gap="250" :max-line-gap="400" :watch="photos">
        <waterfall-slot v-for="(photo,index) in photos"
                        :height="photo.height" :width="photo.width"
                        :order="index" :key="photo.id" move-class="item-move">
          <photo-card :photo="photo" v-on:onItemDeleted="loadPhotos"></photo-card>
        </waterfall-slot>
      </Waterfall>
      <add-photo-dialog ref="addPhotoDialog" @onAddPhotoSucceed="onAddPhotoSucceed"></add-photo-dialog>
    </el-main>
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
  </el-container>
</template>

<script>
import {baseUrl} from "@/utils/global"
import addPhotoDialog from "@/views/Photography/AddPhotoDialog"
import Waterfall from 'vue-waterfall/lib/waterfall'
import WaterfallSlot from 'vue-waterfall/lib/waterfall-slot'
import PhotoCard from "@/components/PhotoCard";

export default {
  name: "Photos",
  components: {
    addPhotoDialog,
    Waterfall,
    WaterfallSlot,
    PhotoCard
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      photos: [],
    }
  },
  mounted() {
    this.loadPhotos()
  },
  methods: {
    loadPhotos() {
      this.$api.photo.getList(this.currentPage, this.pageSize).then(res => {
        console.log(res)
        this.totalCount = res.pagination.totalItemCount
        this.photos = res.data.map(item => ({
          ...item,
          url: `${baseUrl}/media/photography/${item.id}.jpg`
        }))
      })
    },
    handlePageSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.loadPhotos()
    },
    handleCurrentPageChange(page) {
      console.log(page)
      this.currentPage = page
      this.loadPhotos()
    },
    onAddPhotoSucceed() {
      this.$message.success('添加成功')
      this.loadPhotos()
    }
  }
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}
</style>
