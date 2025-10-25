<template>
  <div class="masonry" :style="masonryStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Masonry',
  props: {
    columnWidth: { type: Number, default: 260 },
    gap: { type: Number, default: 16 },
  },
  computed: {
    masonryStyle() {
      return {
        columnWidth: this.columnWidth + 'px',
        columnGap: this.gap + 'px',
        '--masonry-gap': this.gap + 'px',
      }
    }
  }
}
</script>

<style scoped>
.masonry {
  /* 浏览器根据 column-width 自动计算列数 */
  column-fill: balance;
}

/* 让每个子元素在列中避免被拆分，并撑满列宽 */
.masonry > * {
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  display: inline-block;
  width: 100%;
  margin-bottom: var(--masonry-gap);
}
</style>