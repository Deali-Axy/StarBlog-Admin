<template>
  <el-container>
    <!-- 顶部工具栏 -->
    <el-header height="auto" class="photo-header">
      <!-- 搜索和筛选区域 -->
      <el-row :gutter="16" class="mb-3">
        <el-col :span="8">
          <el-input
            v-model="searchQuery"
            placeholder="搜索照片名称或地点..."
            prefix-icon="el-icon-search"
            clearable
            @input="handleSearchInput"
            @clear="handleSearchClear">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select v-model="filterFeatured" placeholder="推荐状态" clearable @change="handleFilterChange">
            <el-option label="全部" value=""></el-option>
            <el-option label="已推荐" value="true"></el-option>
            <el-option label="未推荐" value="false"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="handleFilterChange">
          </el-date-picker>
        </el-col>
        <el-col :span="6">
          <el-button @click="handleClearFilters" icon="el-icon-refresh">清空筛选</el-button>
          <el-button @click="handleRefresh" icon="el-icon-refresh" circle></el-button>
        </el-col>
      </el-row>

      <!-- 使用提示 -->
      <el-alert
        type="info"
        title="使用提示"
        show-icon
        :closable="true"
        class="mt-2"
        description="右键照片打开操作菜单；点击照片预览大图；勾选进行批量操作；顶部支持搜索与筛选。">
      </el-alert>

      <!-- 操作按钮区域 -->
      <el-row type="flex" justify="space-between" align="middle">
        <div>
          <el-button type="primary" @click="$refs.addPhotoDialog.show()" icon="el-icon-plus">
            添加照片
          </el-button>

          <!-- 批量操作 -->
          <el-dropdown @command="handleBatchCommand" :disabled="selectedPhotos.length === 0">
            <el-button type="warning" :disabled="selectedPhotos.length === 0">
              批量操作 ({{ selectedPhotos.length }}) <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="delete" icon="el-icon-delete">批量删除</el-dropdown-item>
              <el-dropdown-item command="setFeatured" icon="el-icon-star-on">批量设为推荐</el-dropdown-item>
              <el-dropdown-item command="cancelFeatured" icon="el-icon-star-off">批量取消推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-button
            @click="selectAll"
            :type="selectedPhotos.length === photos.length && photos.length > 0 ? 'success' : ''"
            icon="el-icon-check">
            {{ selectedPhotos.length === photos.length && photos.length > 0 ? '取消全选' : '全选' }}
          </el-button>
        </div>

        <!-- 统计信息 -->
        <div class="photo-stats">
          <el-tag type="info">总计: {{ totalCount }}</el-tag>
          <el-tag type="success" v-if="featuredCount > 0">推荐: {{ featuredCount }}</el-tag>
          <el-tag type="warning" v-if="selectedPhotos.length > 0">已选: {{ selectedPhotos.length }}</el-tag>
        </div>
      </el-row>
    </el-header>

    <el-main class="photo-main">
      <!-- 加载状态 -->
      <el-skeleton v-if="loading" :rows="3" animated />

      <!-- 照片瀑布流 -->
      <Waterfall
        v-else-if="photos.length > 0"
        align="center"
        :line-gap="300"
        :min-line-gap="250"
        :max-line-gap="400"
        :watch="photos">
        <waterfall-slot
          v-for="(photo, index) in photos"
          :height="photo.height"
          :width="photo.width"
          :order="index"
          :key="photo.id"
          move-class="item-move">
          <enhanced-photo-card
            :photo="photo"
            :selected="isPhotoSelected(photo)"
            @select="handlePhotoSelect"
            @view-detail="handleViewDetail"
            @edit="handleEdit"
            @set-featured="handleSetFeatured"
            @cancel-featured="handleCancelFeatured"
            @delete="handleDelete">
          </enhanced-photo-card>
        </waterfall-slot>
      </Waterfall>

      <!-- 空状态 -->
      <el-empty v-else description="暂无照片" image-size="120">
        <el-button type="primary" @click="$refs.addPhotoDialog.show()">上传第一张照片</el-button>
      </el-empty>

      <!-- 照片详情模态框 -->
      <photo-detail-dialog
        ref="photoDetailDialog"
        :photo="currentPhoto"
        @updated="loadPhotos">
      </photo-detail-dialog>

      <!-- 添加照片对话框 -->
      <add-photo-dialog ref="addPhotoDialog" @onAddPhotoSucceed="onAddPhotoSucceed"></add-photo-dialog>
    </el-main>

    <el-footer height="auto" class="photo-footer">
      <!-- 分页 -->
      <el-pagination
        class="text-center"
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentPageChange"
        :current-page="currentPage"
        :page-sizes="[12, 24, 48, 96]"
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

/**
 * 增强版照片卡片组件
 */
const EnhancedPhotoCard = {
  name: "EnhancedPhotoCard",
  props: {
    photo: Object,
    selected: Boolean
  },
  data() {
    return {
      popoverVisible: false
    }
  },
  computed: {
    /**
     * 格式化日期时间
     */
    dateTimeStr() {
      const dt = new Date(this.photo.createTime)
      return dt.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  },
  methods: {
    /**
     * 处理照片选择
     */
    handleSelect() {
      this.$emit('select', this.photo)
    },
    /**
     * 查看详情
     */
    viewDetail() {
      this.$emit('view-detail', this.photo)
    },
    /**
     * 编辑照片
     */
    editPhoto() {
      this.$emit('edit', this.photo)
    },
    /**
     * 设置推荐
     */
    setFeatured() {
      this.$emit('set-featured', this.photo)
    },
    /**
     * 取消推荐
     */
    cancelFeatured() {
      this.$emit('cancel-featured', this.photo)
    },
    /**
     * 删除照片
     */
    deletePhoto() {
      this.$emit('delete', this.photo)
    },
    toggleContextMenu() {
      this.popoverVisible = !this.popoverVisible
    },
    onGlobalClick(e) {
      if (this.popoverVisible) {
        const isInside = this.$el && this.$el.contains(e.target)
        if (!isInside) this.popoverVisible = false
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.onGlobalClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.onGlobalClick)
  },
  template: `
    <el-popover
      placement="bottom-start"
      width="260"
      trigger="manual"
      v-model="popoverVisible"
      popper-class="photo-context-menu"
      :append-to-body="true">

      <div class="context-content">
        <div class="ctx-info">
          <p>图片名称：{{ photo.title }}</p>
          <p v-if="photo.location">拍摄地点：{{ photo.location }}</p>
          <p>上传时间：{{ dateTimeStr }}</p>
        </div>
        <el-button-group class="ctx-actions">
          <el-button size="mini" icon="el-icon-view" @click="viewDetail">查看详情</el-button>
          <el-button size="mini" icon="el-icon-edit" @click="editPhoto">编辑</el-button>
          <el-button
            size="mini"
            :type="photo.isFeatured ? 'warning' : 'success'"
            :icon="photo.isFeatured ? 'el-icon-star-off' : 'el-icon-star-on'"
            @click="photo.isFeatured ? cancelFeatured() : setFeatured()">
            {{ photo.isFeatured ? '取消推荐' : '设为推荐' }}
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deletePhoto">删除</el-button>
        </el-button-group>
      </div>

      <div slot="reference"
        class="enhanced-photo-card"
        :class="{ 'selected': selected }"
        @contextmenu.prevent.stop="toggleContextMenu">

        <!-- 选择框 -->
        <div class="photo-checkbox" @click.stop="handleSelect">
          <el-checkbox :value="selected"></el-checkbox>
        </div>

        <!-- 推荐角标 -->
        <div v-if="photo.isFeatured" class="featured-badge">
          <i class="el-icon-star-on"></i>
        </div>

        <!-- 照片容器 -->
        <div class="photo-container">
          <!-- 照片 -->
          <el-image
            :src="photo.url"
            class="photo-image"
            :preview-src-list="[photo.url]"
            fit="cover">
            <div slot="placeholder" class="photo-loading">
              <i class="el-icon-loading"></i>
            </div>
            <div slot="error" class="photo-error">
              <i class="el-icon-picture-outline"></i>
              <p>加载失败</p>
            </div>
          </el-image>
        </div>

        <!-- 照片信息 -->
        <div class="photo-info">
          <div class="photo-title" :title="photo.title">{{ photo.title }}</div>
          <div class="photo-meta">
            <span class="photo-location" v-if="photo.location">
              <i class="el-icon-location-outline"></i>
              {{ photo.location }}
            </span>
            <span class="photo-date">{{ dateTimeStr }}</span>
          </div>
        </div>
      </div>
    </el-popover>
  `
}

/**
 * 照片详情对话框组件
 */
const PhotoDetailDialog = {
  name: "PhotoDetailDialog",
  props: {
    photo: Object
  },
  data() {
    return {
      visible: false,
      editForm: {
        title: '',
        location: ''
      },
      editMode: false,
      loading: false
    }
  },
  watch: {
    photo: {
      handler(newPhoto) {
        if (newPhoto) {
          this.editForm.title = newPhoto.title
          this.editForm.location = newPhoto.location
        }
      },
      immediate: true
    }
  },
  computed: {
    /**
      * 格式化创建时间
      */
     createTimeStr() {
       if (!this.photo || !this.photo.createTime) return ''
       return new Date(this.photo.createTime).toLocaleString('zh-CN')
     }
  },
  methods: {
    /**
     * 显示对话框
     */
    show() {
      this.visible = true
      this.editMode = false
    },
    /**
     * 隐藏对话框
     */
    hide() {
      this.visible = false
    },
    /**
     * 开始编辑
     */
    startEdit() {
      this.editMode = true
    },
    /**
     * 取消编辑
     */
    cancelEdit() {
      this.editMode = false
      this.editForm.title = this.photo.title
      this.editForm.location = this.photo.location
    },
    /**
     * 保存编辑
     */
    async saveEdit() {
      // 这里需要实现编辑API，当前photo.js中没有update接口
      this.$message.info('编辑功能需要后端API支持')
      this.editMode = false
    },
    /**
     * 设置推荐
     */
    async setFeatured() {
      try {
        await this.$api.photo.setFeatured(this.photo.id)
        this.$message.success('设置推荐成功')
        this.photo.isFeatured = true
        this.$emit('updated')
      } catch (error) {
        this.$message.error('设置推荐失败：' + error.message)
      }
    },
    /**
     * 取消推荐
     */
    async cancelFeatured() {
      try {
        await this.$api.photo.cancelFeatured(this.photo.id)
        this.$message.success('取消推荐成功')
        this.photo.isFeatured = false
        this.$emit('updated')
      } catch (error) {
        this.$message.error('取消推荐失败：' + error.message)
      }
    }
  },
  template: `
    <el-dialog
      title="照片详情"
      :visible.sync="visible"
      width="60%"
      :before-close="hide">

      <div v-if="photo" class="photo-detail">
        <el-row :gutter="20">
          <!-- 照片预览 -->
          <el-col :span="12">
            <div class="detail-image-container">
              <el-image
                :src="photo.url"
                class="detail-image"
                :preview-src-list="[photo.url]"
                fit="contain">
              </el-image>
            </div>
          </el-col>

          <!-- 照片信息 -->
          <el-col :span="12">
            <div class="detail-info">
              <!-- 编辑模式 -->
              <div v-if="editMode">
                <el-form :model="editForm" label-width="80px">
                  <el-form-item label="照片名称">
                    <el-input v-model="editForm.title"></el-input>
                  </el-form-item>
                  <el-form-item label="拍摄地点">
                    <el-input v-model="editForm.location"></el-input>
                  </el-form-item>
                </el-form>

                <div class="edit-actions">
                  <el-button @click="cancelEdit">取消</el-button>
                  <el-button type="primary" @click="saveEdit" :loading="loading">保存</el-button>
                </div>
              </div>

              <!-- 查看模式 -->
              <div v-else>
                <div class="info-item">
                  <label>照片名称：</label>
                  <span>{{ photo.title }}</span>
                </div>

                <div class="info-item">
                  <label>拍摄地点：</label>
                  <span>{{ photo.location || '未设置' }}</span>
                </div>

                <div class="info-item">
                  <label>上传时间：</label>
                  <span>{{ createTimeStr }}</span>
                </div>

                <div class="info-item">
                  <label>推荐状态：</label>
                  <el-tag :type="photo.isFeatured ? 'success' : 'info'">
                    {{ photo.isFeatured ? '已推荐' : '未推荐' }}
                  </el-tag>
                </div>

                <div class="info-item">
                  <label>照片ID：</label>
                  <span>{{ photo.id }}</span>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="detail-actions" v-if="!editMode">
                <el-button @click="startEdit" icon="el-icon-edit">编辑信息</el-button>
                <el-button
                  :type="photo.isFeatured ? 'warning' : 'success'"
                  :icon="photo.isFeatured ? 'el-icon-star-off' : 'el-icon-star-on'"
                  @click="photo.isFeatured ? cancelFeatured() : setFeatured()">
                  {{ photo.isFeatured ? '取消推荐' : '设为推荐' }}
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
  `
}

export default {
  name: "Photos",
  components: {
    addPhotoDialog,
    Waterfall,
    WaterfallSlot,
    EnhancedPhotoCard,
    PhotoDetailDialog
  },
  data() {
    return {
      // 分页数据
      currentPage: 1,
      pageSize: 24,
      totalCount: 0,

      // 照片数据
      photos: [],
      loading: false,

      // 搜索和筛选
      searchQuery: '',
      searchTimer: null,
      filterFeatured: '',
      dateRange: null,

      // 批量操作
      selectedPhotos: [],

      // 统计信息
      featuredCount: 0,

      // 当前查看的照片
      currentPhoto: null
    }
  },
  mounted() {
    this.loadPhotos()
    this.loadFeaturedCount()
  },
  methods: {
    /**
     * 加载照片列表
     */
    async loadPhotos() {
      this.loading = true
      try {
        const params = {
          page: this.currentPage,
          pageSize: this.pageSize
        }

        // 添加搜索参数（需要后端支持）
        if (this.searchQuery) {
          params.search = this.searchQuery
        }

        if (this.filterFeatured !== '') {
          params.isFeatured = this.filterFeatured
        }

        if (this.dateRange && this.dateRange.length === 2) {
          params.startDate = this.dateRange[0]
          params.endDate = this.dateRange[1]
        }

        const res = await this.$api.photo.getList(this.currentPage, this.pageSize)
        console.log('照片列表:', res)

        this.totalCount = res.pagination.totalItemCount
        this.photos = res.data.map(item => ({
          ...item,
          url: `${baseUrl}/media/photography/${item.filePath}`,
          isFeatured: item.isFeatured || false // 假设API返回推荐状态
        }))

        // 清空选择
        this.selectedPhotos = []

      } catch (error) {
        console.error('加载照片失败:', error)
        this.$message.error('加载照片失败：' + error.message)
      } finally {
        this.loading = false
      }
    },

    /**
     * 加载推荐照片数量
     */
    async loadFeaturedCount() {
      try {
        const res = await this.$api.featuredPhoto.getAll()
        this.featuredCount = res.data.length
      } catch (error) {
        console.error('加载推荐数量失败:', error)
      }
    },

    /**
     * 处理搜索输入（防抖）
     */
    handleSearchInput() {
      if (this.searchTimer) {
        clearTimeout(this.searchTimer)
      }

      this.searchTimer = setTimeout(() => {
        this.currentPage = 1
        this.loadPhotos()
      }, 500)
    },

    /**
     * 清空搜索
     */
    handleSearchClear() {
      this.searchQuery = ''
      this.currentPage = 1
      this.loadPhotos()
    },

    /**
     * 处理筛选变化
     */
    handleFilterChange() {
      this.currentPage = 1
      this.loadPhotos()
    },

    /**
     * 清空所有筛选
     */
    handleClearFilters() {
      this.searchQuery = ''
      this.filterFeatured = ''
      this.dateRange = null
      this.currentPage = 1
      this.loadPhotos()
    },

    /**
     * 刷新数据
     */
    handleRefresh() {
      this.loadPhotos()
      this.loadFeaturedCount()
    },

    /**
     * 处理页面大小变化
     */
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.currentPage = 1
      this.loadPhotos()
    },

    /**
     * 处理当前页变化
     */
    handleCurrentPageChange(page) {
      this.currentPage = page
      this.loadPhotos()
    },

    /**
     * 添加照片成功回调
     */
    onAddPhotoSucceed() {
      this.$message.success('添加成功')
      this.loadPhotos()
      this.loadFeaturedCount()
    },

    /**
     * 检查照片是否被选中
     */
    isPhotoSelected(photo) {
      return this.selectedPhotos.some(p => p.id === photo.id)
    },

    /**
     * 处理照片选择
     */
    handlePhotoSelect(photo) {
      const index = this.selectedPhotos.findIndex(p => p.id === photo.id)
      if (index > -1) {
        this.selectedPhotos.splice(index, 1)
      } else {
        this.selectedPhotos.push(photo)
      }
    },

    /**
     * 全选/取消全选
     */
    selectAll() {
      if (this.selectedPhotos.length === this.photos.length && this.photos.length > 0) {
        this.selectedPhotos = []
      } else {
        this.selectedPhotos = [...this.photos]
      }
    },

    /**
     * 处理批量操作命令
     */
    async handleBatchCommand(command) {
      if (this.selectedPhotos.length === 0) {
        this.$message.warning('请先选择照片')
        return
      }

      switch (command) {
        case 'delete':
          await this.handleBatchDelete()
          break
        case 'setFeatured':
          await this.handleBatchSetFeatured()
          break
        case 'cancelFeatured':
          await this.handleBatchCancelFeatured()
          break
      }
    },

    /**
     * 批量删除
     */
    async handleBatchDelete() {
      try {
        await this.$confirm(`确定要删除选中的 ${this.selectedPhotos.length} 张照片吗？`, '批量删除', {
          type: 'warning'
        })

        const deletePromises = this.selectedPhotos.map(photo =>
          this.$api.photo.deleteItem(photo.id)
        )

        await Promise.all(deletePromises)
        this.$message.success('批量删除成功')
        this.selectedPhotos = []
        this.loadPhotos()
        this.loadFeaturedCount()

      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('批量删除失败：' + error.message)
        }
      }
    },

    /**
     * 批量设置推荐
     */
    async handleBatchSetFeatured() {
      try {
        const setPromises = this.selectedPhotos.map(photo =>
          this.$api.photo.setFeatured(photo.id)
        )

        await Promise.all(setPromises)
        this.$message.success('批量设置推荐成功')
        this.selectedPhotos = []
        this.loadPhotos()
        this.loadFeaturedCount()

      } catch (error) {
        this.$message.error('批量设置推荐失败：' + error.message)
      }
    },

    /**
     * 批量取消推荐
     */
    async handleBatchCancelFeatured() {
      try {
        const cancelPromises = this.selectedPhotos.map(photo =>
          this.$api.photo.cancelFeatured(photo.id)
        )

        await Promise.all(cancelPromises)
        this.$message.success('批量取消推荐成功')
        this.selectedPhotos = []
        this.loadPhotos()
        this.loadFeaturedCount()

      } catch (error) {
        this.$message.error('批量取消推荐失败：' + error.message)
      }
    },

    /**
     * 查看照片详情
     */
    handleViewDetail(photo) {
      this.currentPhoto = photo
      this.$refs.photoDetailDialog.show()
    },

    /**
     * 编辑照片
     */
    handleEdit(photo) {
      this.currentPhoto = photo
      this.$refs.photoDetailDialog.show()
      this.$nextTick(() => {
        this.$refs.photoDetailDialog.startEdit()
      })
    },

    /**
     * 设置推荐
     */
    async handleSetFeatured(photo) {
      try {
        await this.$api.photo.setFeatured(photo.id)
        this.$message.success('设置推荐成功')
        photo.isFeatured = true
        this.loadFeaturedCount()
      } catch (error) {
        this.$message.error('设置推荐失败：' + error.message)
      }
    },

    /**
     * 取消推荐
     */
    async handleCancelFeatured(photo) {
      try {
        await this.$api.photo.cancelFeatured(photo.id)
        this.$message.success('取消推荐成功')
        photo.isFeatured = false
        this.loadFeaturedCount()
      } catch (error) {
        this.$message.error('取消推荐失败：' + error.message)
      }
    },

    /**
     * 删除照片
     */
    async handleDelete(photo) {
      try {
        await this.$confirm('此操作将永久删除该照片, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })

        await this.$api.photo.deleteItem(photo.id)
        this.$message.success('删除成功')
        this.loadPhotos()
        this.loadFeaturedCount()

        // 如果删除的照片在选中列表中，移除它
        const index = this.selectedPhotos.findIndex(p => p.id === photo.id)
        if (index > -1) {
          this.selectedPhotos.splice(index, 1)
        }

      } catch (error) {
        if (error !== 'cancel') {
          this.$message.error('删除失败：' + error.message)
        }
      }
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
