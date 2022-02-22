<template>
  <el-container>
    <el-header height="30px">
      <el-row type="flex" justify="start">
        <div>
          <el-button @click="dialogFormVisible = true">添加</el-button>
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
      <el-dialog title="上传图片" :visible.sync="dialogFormVisible" width="30%">
        <el-form ref="uploadForm" :model="form" :rules="formRules" label-width="80px">
          <el-form-item label="图片名称" prop="title">
            <el-input v-model="form.title" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <el-upload ref="upload" drag action=""
                   accept="image/jpeg,image/png"
                   :on-change="onUploadChange"
                   :auto-upload="false">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitUpload">确 定</el-button>
        </div>
      </el-dialog>
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
export default {
  name: "Photos",
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 1000,
      photos: [],
      dialogFormVisible: false,
      form: {
        title: '',
        file: null
      },
      formRules: {
        title: [
          {required: true, message: '请输入图片标题', trigger: 'blur'},
          {min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur'}
        ],
      }
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
          url: `http://localhost:5038/media/photography/${item.id}.jpg`
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
    onUploadChange(file) {
      const isIMAGE = (file.raw.type === 'image/jpeg' || file.raw.type === 'image/png')
      if (!isIMAGE) {
        this.$message.error('只能上传jpg/png图片!')
        return false
      }
      this.form.file = file
    },
    submitUpload() {
      // this.$refs.upload.submit()
      this.$refs.uploadForm.validate((valid) => {
        if (!valid) return false;
        console.log(this.form)

        this.$api.photo.add(this.form.title, this.form.file.raw)
          .then(res => {
            console.log(res.data)
            if (res.successful) {
              this.dialogFormVisible = false
              this.loadPhotos()
            }
          })
      })
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
