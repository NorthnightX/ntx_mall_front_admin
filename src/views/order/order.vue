<template>
  <div class="order">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "order",
  data(){
    /* 定义初始化变量 */
    return{

    }
  },
  /* 定义事件函数 */
  methods:{

  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {

  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
