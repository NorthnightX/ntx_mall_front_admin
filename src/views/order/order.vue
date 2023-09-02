<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.status" placeholder="请选择所属分类">
          <el-option label="全部" value=""></el-option>
          <el-option label="已支付" value=20></el-option>
          <el-option label="已取消" value=0></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.productName" placeholder="输入商品名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="orderData" highlight-current-row
              border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="orderNo" label="订单Id" width="155">
      </el-table-column>
      <el-table-column align="center" sortable prop="userName" label="用户名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="paymentTypeName" label="支付方式" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="payment" label="实付金额" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="paymentTypeName" label="订单详情" width="120">
        <template slot-scope="scope">
          <el-button size="mini" @click="showOrderItem(scope.row.orderItemList)" type="text">点击查看详情</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="statusName" label="状态" min-width="150">
      </el-table-column>
      <!--      <el-table-column align="center" sortable prop="paymentTime" label="支付时间" width="220">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" sortable prop="sendTime" label="送达时间" width="220">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" sortable prop="endTime" label="交易完成时间" width="220">-->
      <!--      </el-table-column>-->
      <!--      <el-table-column align="center" sortable prop="closeTime" label="交易关闭时间" width="220">-->
      <!--      </el-table-column>-->
      <el-table-column align="center" sortable prop="gmtCreate" label="创建时间" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="gmtModified" label="修改时间" width="220">
      </el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="send(scope.row)" v-show="scope.row.status === 20">发货</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="订单详情" :visible.sync="dialogTableVisible">
      <el-table :data="orderItemList">
        <el-table-column property="productName" label="商品" width="150"></el-table-column>
        <el-table-column property="quantity" label="数量" width="200"></el-table-column>
        <el-table-column property="currentUnitPrice" label="金额（单位元）"></el-table-column>
      </el-table>
    </el-dialog>

    <!--    分页条-->
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[10, 15, 20, 25]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

export default {
  name: "agent",
  data() {
    /* 定义初始化变量 */
    return {
      dialogTableVisible: false,
      orderItemList: [],
      orderData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      nshow: true, //switch开启
      fshow: false, //switch关闭
      formInline: {
        productName: '',
        status: ''
      }
    }
  },
  /* 定义事件函数 */
  methods: {
    send(order){
      this.$axios.put(`order/send/${order.orderNo}`).then(res => {
        if(res.data.code === 200){
          this.$message.success("发货成功");
          this.queryAll()
        }
        else{
          this.$message.error(res.data.message)
        }
      })
    },
    showOrderItem(orderItemList) {
      this.orderItemList = orderItemList
      this.dialogTableVisible = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },
    search() {
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get("order/queryAll", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          productName: this.formInline.productName,
          status: this.formInline.status
        }
      }).then(res => {
        this.orderData = res.data.data.records
        this.total = res.data.data.total
      })
    }

  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
