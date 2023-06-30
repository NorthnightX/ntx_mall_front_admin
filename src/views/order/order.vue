<template>
  <div class="order">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-form-item  prop="departureAirportId">
          <el-select size="small" @change='queryByStartAirport($event)' v-model="formInline.departureAirportId" filterable clearable placeholder="请选择起始机场">
            <el-option
              v-for="item in city"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="destinationAirport">
          <el-select size="small" v-model="formInline.destinationAirportId"  :disabled = disabled filterable clearable placeholder="请选择目的机场">
            <el-option
              v-for="item in startRoute"
              :key="item.id"
              :label="item.airportName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  prop="orderTime">
          <el-date-picker
            v-model="formInline.orderTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择订单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
        </el-form-item>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" :data="orderData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center"  prop="departureAirport" label="起始机场" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="destinationAirport" label="目的机场" width="150">
      </el-table-column>
      <el-table-column align="center"  prop="aircraftCode" label="飞机编号" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="bookingPerson" label="订票人" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="passenger" label="乘机人" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="seatType" label="舱位种类" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="amount" label="实付金额" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="orderTime" label="订单时间" width="150">
      </el-table-column>
      <el-table-column
        label="是否升舱" align="center" sortable prop="isUpgrade">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isUpgrade === 0 ? 'success' : 'info'"
          >
            {{ scope.row.isUpgrade === 0 ? '未升舱' : '升舱' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="订单状态" align="center" sortable prop="isCancelled">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isCancelled === 0 ? 'success' : 'info'">
            {{ scope.row.isCancelled === 1 ? '已完成' : '取消' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否托运" align="center" sortable prop="isCheckedBaggage">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isCheckedBaggage === 0 ? 'success' : 'info'">
            {{ scope.row.isCheckedBaggage === 0 ? '否' : '托运' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" min-width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteOrder(scope.row.orderId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="50%" @click='closeDialog("edit")'>
      <el-form label-width="140px" ref="editOrderForm" :model="editOrderForm" :rules="rules">
        <el-form-item label="订单时间" prop="orderTime">
          <el-date-picker
            v-model="editOrderForm.orderTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="实付金额" prop="amount">
          <el-input type="number" size="small" v-model="editOrderForm.amount" auto-complete="off" placeholder="请输入实付金额"></el-input>
        </el-form-item>
        <el-form-item label="是否托运" prop="isCheckedBaggage">
          <el-select size="small" v-model="editOrderForm.isCheckedBaggage" placeholder="请选择">
            <el-option label="托运" :value="1"></el-option>
            <el-option label="未托运" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否升舱" prop="isUpgrade">
          <el-select size="small" v-model="editOrderForm.isUpgrade" placeholder="请选择">
            <el-option label="升舱" :value="1"></el-option>
            <el-option label="未升舱" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否退票" prop="isCancelled">
          <el-select size="small" v-model="editOrderForm.isCancelled" placeholder="请选择">
            <el-option label="未退票" :value="1"></el-option>
            <el-option label="退票" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否未升舱机票" prop="isUpgradeOrder">
          <el-select size="small" v-model="editOrderForm.isUpgradeOrder" placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="不是" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editOrderForm')">保存</el-button>
      </div>
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
  name: "order",
  data(){
    /* 定义初始化变量 */
    return{
      editAddFlightForm:{
        departureAirportId : '',
        aircraftId: '',
        departureTime:'',
        arrivalTime:'',
        economyClassNum:'',
        firstClassNum:'',
        firstClassPrice:'',
        economyClassPrice:'',
        destinationAirportId:''
      },
      disabled : true,
      title: "修改订单",
      loading: false, //显示加载
      editFormVisible: false,
      addFormVisible : false,
      // 列表信息
      orderData:[],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      editOrderForm:{
        orderTime:'',
        amount:'',
        isCheckedBaggage:'',
        isUpgrade:'',
        isCancelled:'',
        isUpgradeOrder:''
      },


      rules: {
        orderTime: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        amount: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        isCheckedBaggage: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        isUpgrade: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        isCancelled: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ],
        isUpgradeOrder: [
          {required: true, message: '该项不能为空', trigger: 'blur'}
        ]
      },
      city:[],
      plane:[],
      startRoute:[],
      // 条件查找
      formInline: {
        departureAirportId:'',
        destinationAirportId:'',
        orderTime:''
      },
    }
  },
  /* 定义事件函数 */
  methods:{
    closeDialog() {
      this.editFormVisible = false
      this.addFormVisible = false
    },
    queryByStartAirport(id){
      this.$axios.get('/route/getByStartAirport?id=' + id).then(res => {
        this.startRoute = res.data.data
        this.disabled = false
      })
    },
    // 打开编辑窗口
    handleEdit(order) {
      this.editFormVisible = true
      this.editOrderForm = {...order}

      this.queryAllCity()
      this.queryPlaneMsg()
      this.disabled = true
    },
    submitForm(formName) {
      this.$axios.put("/order/updateOrder", this.editOrderForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.queryAllCity()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    // 删除
    deleteOrder(id){
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.post(`/order/delete/${id}`).then(res =>{
          if(res.data.code === 200){
            this.pageNum = 1
            this.queryAll()
            this.queryAllCity()
            this.$message.success("删除成功")
          } else {
            this.$message.error(res.data.data)
          }
        })
      })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    queryPlaneMsg(){
      this.$axios.get('/aircraftInformation/getAllPlane').then(res => {
        this.plane = res.data.data
      })
    },
    queryAllCity(){
      this.$axios.get('/airport/getAllAirport').then(res => {
        this.city = res.data.data
        this.startRoute = this.city
      })
    },
    search(){
      this.pageNum = 1
      this.queryAll()
      this.queryAllCity()
      this.disabled = true
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
      this.queryAllCity()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
      this.queryAllCity()
    },
    queryAll() {
      this.$axios.get('/order/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          departureAirportId: this.formInline.departureAirportId,
          destinationAirportId: this.formInline.destinationAirportId,
          orderTime: this.formInline.orderTime

        }
      }).then(res => {
        if(res.data.code === 200){
          this.orderData = res.data.data.records
          this.pageNum = res.data.data.current
          this.total = res.data.data.total
        } else {
          this.$message.warning(res.data.data)
        }

      })
    }
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
    this.queryAllCity()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
