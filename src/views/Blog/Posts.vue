<template>
  <!--  只要在el-table元素中定义了height属性，即可实现固定表头的表格，而不需要额外的代码。-->
  <el-table
    :data="posts"
    height="800"
    stripe
    style="width: 100%">
    <el-table-column
      prop="title"
      label="标题"
      width="800">
    </el-table-column>
    <el-table-column
      prop="creationTime"
      label="creationTime">
    </el-table-column>
    <el-table-column
      prop="lastUpdateTime"
      label="lastUpdateTime">
    </el-table-column>
    <el-table-column
      prop="category.name"
      label="category">
    </el-table-column>
    <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
        <el-button type="text" size="small">编辑</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'Posts',
  data() {
    return {
      posts: [],
    }
  },
  mounted() {
    this.$api.blog.getList()
      .then(res => {
        console.log(res)
        this.posts = res
      })
  },
  methods: {
    handleClick(row) {
      console.log(row)
    }
  }
}
</script>
