<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="start">
        <div>
          <el-button @click="$refs.addPhotoDiaglog.show()">添加</el-button>
          <el-button type="danger">批量删除</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <el-row :gutter="10">
        <el-col :span="4" v-for="photo in photos" :key="photo.id">
          <el-card :body-style="{ padding: '0px' }">
            <el-image :src="photo.url" class="image" alt=""></el-image>
            <div style="padding: 14px;">
              <div>{{ photo.title }}</div>
              <div>
                <time class="time">{{ photo.createTime }}</time>
              </div>
              <div class="bottom clearfix">
                <el-button-group>
                  <el-button type="" icon="el-icon-edit"></el-button>
                  <el-button type="" icon="el-icon-share"></el-button>
                  <el-button type="" icon="el-icon-delete"></el-button>
                </el-button-group>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <add-photo-dialog ref="addPhotoDiaglog" @onAddPhotoSucceed="onAddPhotoSucceed"></add-photo-dialog>
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

export default {
  name: "Photos",
  components: {
    addPhotoDialog
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
        console.log(this.photos)
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
