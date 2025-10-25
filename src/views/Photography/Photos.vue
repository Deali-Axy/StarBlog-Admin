<template>
  <el-container>
    <el-header height="72px">
      <el-row type="flex" justify="space-between" align="middle">
        <div class="header-left">
          <el-button type="primary" @click="$refs.addPhotoDialog.show()">添加</el-button>
          <el-button :type="selectionMode ? 'warning' : ''" @click="toggleSelectionMode">
            {{ selectionMode ? '退出选择模式' : '选择模式' }}
          </el-button>
          <el-dropdown :hide-on-click="false">
            <el-button type="danger" :disabled="selectedIds.length===0">
              批量操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="selectedIds.length===0" @click.native="handleBatchDelete">批量删除</el-dropdown-item>
              <el-dropdown-item :disabled="selectedIds.length===0" @click.native="handleBatchSetFeatured">批量设为推荐</el-dropdown-item>
              <el-dropdown-item :disabled="selectedIds.length===0" @click.native="handleBatchCancelFeatured">批量取消推荐</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="header-right">
          <el-input placeholder="搜索标题或拍摄地点" v-model="searchKeyword" clearable size="small"
                    class="mr-2" @input="onFilterInput" @clear="applyFilters" style="width: 240px;"/>
          <el-select v-model="featuredFilter" size="small" class="mr-2" style="width: 140px;" @change="applyFilters">
            <el-option label="全部" value="all"/>
            <el-option label="已推荐" value="featured"/>
            <el-option label="未推荐" value="unfeatured"/>
          </el-select>
          <el-button size="small" @click="clearFilters">清空筛选</el-button>
        </div>
      </el-row>
      <el-alert v-if="guideVisible" title="使用提示" type="info" show-icon closable class="mt-2"
                description="点击图片可预览，右上角“更多”查看操作；可开启选择模式进行批量删除/推荐/取消推荐。"/>
    </el-header>
    <el-main v-loading="loading">
      <div style="margin-bottom: 10px; font-size: 12px; color: #666;">
        调试信息: loading={{loading}}, photos.length={{photos.length}}, allPhotos.length={{allPhotos.length}}
      </div>
      <template v-if="loading">
        <div class="skeleton-grid">
          <el-skeleton v-for="n in 8" :key="n" :rows="4" animated style="margin: 8px; width: 260px;"/>
        </div>
      </template>
      <template v-else>
        <Masonry v-if="photos.length > 0" :column-width="260" :gap="16">
          <photo-card v-for="photo in photos"
                      :key="photo.id"
                      :photo="photo"
                      :selection-mode="selectionMode"
                      :selected="selectedIds.includes(photo.id)"
                      @onItemDeleted="loadPhotos"
                      @onSelectChange="onCardSelectChange"
                      @onFeaturedChange="onCardFeaturedChange"
                      @onEdit="openEditDialog"
          />
        </Masonry>
        <el-empty v-else description="暂无数据"/>
      </template>
      <add-photo-dialog ref="addPhotoDialog" @onAddPhotoSucceed="onAddPhotoSucceed"></add-photo-dialog>
      <edit-photo-dialog ref="editPhotoDialog" @onUpdateSucceed="onEditSucceed"></edit-photo-dialog>
    </el-main>
    <el-footer height="48px">
      <el-pagination
        class="py-3 text-center"
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
import { baseUrl } from "@/utils/global"
import addPhotoDialog from "@/views/Photography/AddPhotoDialog"
import editPhotoDialog from "@/views/Photography/EditPhotoDialog"
import Masonry from "@/components/Masonry/index.vue"
import PhotoCard from "@/components/PhotoCard";

export default {
  name: "Photos",
  components: {
    addPhotoDialog,
    editPhotoDialog,
    Masonry,
    PhotoCard
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      allPhotos: [],
      photos: [],
      loading: false,
      // 选择与批量
      selectionMode: false,
      selectedIds: [],
      // 搜索与筛选
      searchKeyword: '',
      featuredFilter: 'all', // all | featured | unfeatured
      filterTimer: null,
      guideVisible: true,
      featuredIdSet: new Set(),
    }
  },
  mounted() {
    this.loadPhotos()
  },
  methods: {
    async loadPhotos() {
      this.loading = true
      console.log('开始加载照片...')
      try {
        const res = await this.$api.photo.getList(this.currentPage, this.pageSize)
        console.log('API响应:', res)
        this.totalCount = res.pagination.totalItemCount
        this.allPhotos = res.data.map(item => ({
          ...item,
          url: `${baseUrl}/media/photography/${item.id}.jpg`,
          isFeatured: false,
          // 为瀑布流添加默认尺寸，实际会根据图片自适应
          width: 260,
          height: Math.floor(Math.random() * 200) + 200, // 随机高度200-400px
        }))
        console.log('处理后的照片数据:', this.allPhotos)
        // 等待推荐状态同步完成后再应用筛选
        await this.syncFeatured()
        this.applyFilters()
        console.log('最终显示的照片:', this.photos)
      } catch (err) {
        console.error('加载图片失败:', err)
        this.$message.error(`加载图片失败：${err.message || err}`)
      } finally {
        this.loading = false
        console.log('加载完成，loading状态:', this.loading)
      }
    },
    async syncFeatured() {
      console.log('开始同步推荐状态...')
      try {
        const resFeatured = await this.$api.featuredPhoto.getAll()
        console.log('推荐照片API响应:', resFeatured)
        const ids = new Set((resFeatured.data || []).map(fp => fp.photo.id))
        this.featuredIdSet = ids
        this.allPhotos = this.allPhotos.map(p => ({ ...p, isFeatured: ids.has(p.id) }))
        console.log('同步推荐状态后的照片:', this.allPhotos)
      } catch (err) {
        console.error('获取推荐状态失败:', err)
        // 非关键失败，提示但不中断
        this.$message.warning(`获取推荐状态失败：${err.message || err}`)
      }
    },
    applyFilters() {
      console.log('应用筛选，当前条件:', { searchKeyword: this.searchKeyword, featuredFilter: this.featuredFilter })
      const kw = (this.searchKeyword || '').trim().toLowerCase()
      let list = this.allPhotos.slice()
      console.log('筛选前的照片数量:', list.length)
      if (kw) {
        list = list.filter(p => (p.title || '').toLowerCase().includes(kw) || (p.location || '').toLowerCase().includes(kw))
        console.log('搜索筛选后的照片数量:', list.length)
      }
      if (this.featuredFilter === 'featured') {
        list = list.filter(p => p.isFeatured)
        console.log('推荐筛选后的照片数量:', list.length)
      } else if (this.featuredFilter === 'unfeatured') {
        list = list.filter(p => !p.isFeatured)
        console.log('未推荐筛选后的照片数量:', list.length)
      }
      this.photos = list
      console.log('最终筛选结果:', this.photos)
    },
    onFilterInput() {
      clearTimeout(this.filterTimer)
      this.filterTimer = setTimeout(() => this.applyFilters(), 350)
    },
    clearFilters() {
      this.searchKeyword = ''
      this.featuredFilter = 'all'
      this.applyFilters()
    },
    // 选择模式
    toggleSelectionMode() {
      this.selectionMode = !this.selectionMode
      if (!this.selectionMode) {
        this.selectedIds = []
      }
    },
    onCardSelectChange({ id, selected }) {
      const idx = this.selectedIds.indexOf(id)
      if (selected && idx < 0) this.selectedIds.push(id)
      if (!selected && idx >= 0) this.selectedIds.splice(idx, 1)
    },
    onCardFeaturedChange({ id, isFeatured }) {
      const target = this.allPhotos.find(p => p.id === id)
      if (target) {
        target.isFeatured = isFeatured
        this.applyFilters()
      }
    },
    // 批量操作
    async handleBatchDelete() {
      if (this.selectedIds.length === 0) return
      try {
        await this.$confirm(`将删除选中的 ${this.selectedIds.length} 张图片，是否继续？`, '确认', { type: 'warning' })
        await Promise.all(this.selectedIds.map(id => this.$api.photo.deleteItem(id)))
        this.$message.success('批量删除成功')
        this.selectedIds = []
        await this.loadPhotos()
      } catch (err) {
        if (err !== 'cancel') this.$message.error(`批量删除失败：${err.message || err}`)
      }
    },
    async handleBatchSetFeatured() {
      if (this.selectedIds.length === 0) return
      try {
        await Promise.all(this.selectedIds.map(id => this.$api.photo.setFeatured(id)))
        this.$message.success('批量设为推荐成功')
        await this.loadPhotos()
      } catch (err) {
        this.$message.error(`批量设置失败：${err.message || err}`)
      }
    },
    async handleBatchCancelFeatured() {
      if (this.selectedIds.length === 0) return
      try {
        await Promise.all(this.selectedIds.map(id => this.$api.photo.cancelFeatured(id)))
        this.$message.success('批量取消推荐成功')
        await this.loadPhotos()
      } catch (err) {
        this.$message.error(`批量取消失败：${err.message || err}`)
      }
    },
    // 分页
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.loadPhotos()
    },
    handleCurrentPageChange(page) {
      this.currentPage = page
      this.loadPhotos()
    },
    onAddPhotoSucceed() {
      this.$message.success('添加成功')
      this.loadPhotos()
    },
    openEditDialog(photo) {
      this.$refs.editPhotoDialog.show(photo)
    },
    onEditSucceed() {
      this.$message.success('更新成功')
      this.loadPhotos()
    }
  }
}
</script>

<style scoped>
 .header-left > * { margin-right: 8px; }
 .header-right > * { margin-left: 8px; }
 .mt-2 { margin-top: 8px; }
 .mr-2 { margin-right: 8px; }
 .skeleton-grid { display: flex; flex-wrap: wrap; justify-content: center; }
 .image { width: 100%; display: block; }
 .photo-grid {
   display: grid;
   grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
   gap: 16px;
   padding: 16px;
 }
</style>
