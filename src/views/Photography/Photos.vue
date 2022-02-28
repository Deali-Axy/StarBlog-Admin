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
          <el-popover
            placement="top"
            width="200"
            trigger="hover">
            <p>图片名称：{{ photo.title }}</p>
            <p>拍摄地点：{{ photo.location }}</p>
            <el-button-group>
              <el-button type="" icon="el-icon-edit"></el-button>
              <el-button type="" icon="el-icon-share"></el-button>
              <el-button type="" icon="el-icon-delete"></el-button>
            </el-button-group>
            <el-card slot="reference" :body-style="{ padding: '0px' }" style="margin: 5px;">
              <el-image :src="photo.url" class="image" :preview-src-list="[photo.url]"></el-image>
            </el-card>
          </el-popover>


          <!--          <el-card class="item" :body-style="{ padding: '0px' }" style="margin: 5px;">-->
          <!--            <el-image :src="photo.url" class="image" :preview-src-list="[photo.url]"></el-image>-->
          <!--            <div style="padding: 14px;">-->
          <!--              <div>{{ photo.title }}</div>-->
          <!--              <div>-->
          <!--                <time class="time">{{ photo.createTime }}</time>-->
          <!--              </div>-->
          <!--              <div class="bottom clearfix">-->
          <!--                <el-button-group>-->
          <!--                  <el-button type="" icon="el-icon-edit"></el-button>-->
          <!--                  <el-button type="" icon="el-icon-share"></el-button>-->
          <!--                  <el-button type="" icon="el-icon-delete"></el-button>-->
          <!--                </el-button-group>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </el-card>-->


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

export default {
  name: "Photos",
  components: {
    addPhotoDialog,
    Waterfall,
    WaterfallSlot
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
        console.log('photos', this.photos)
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
