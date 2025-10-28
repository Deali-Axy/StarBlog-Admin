<template>
  <div 
    class="resizable-divider" 
    @mousedown="startResize"
    :class="{ 'resizing': isResizing }"
  >
    <div class="divider-line"></div>
    <div class="divider-handle">
      <i class="el-icon-more"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "ResizableDivider",
  props: {
    isResizing: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    startResize(event) {
      this.$emit('start-resize', event);
    }
  }
}
</script>

<style scoped>
.resizable-divider {
  width: 4px;
  background: #f5f7fa;
  cursor: col-resize;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  user-select: none;
}

.resizable-divider:hover {
  background: #e4e7ed;
}

.resizable-divider.resizing {
  background: #409eff;
}

.divider-line {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 1px;
  height: 100%;
  background: #dcdfe6;
  transition: background-color 0.2s ease;
}

.resizable-divider:hover .divider-line {
  background: #c0c4cc;
}

.resizable-divider.resizing .divider-line {
  background: #409eff;
}

.divider-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(90deg);
  width: 20px;
  height: 20px;
  background: #fff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.2s ease;
  font-size: 12px;
  color: #909399;
}

.resizable-divider:hover .divider-handle {
  opacity: 1;
}

.resizable-divider.resizing .divider-handle {
  opacity: 1;
  border-color: #409eff;
  color: #409eff;
}

/* 响应式设计 - 在小屏幕上隐藏分割线 */
@media (max-width: 768px) {
  .resizable-divider {
    display: none;
  }
}
</style>