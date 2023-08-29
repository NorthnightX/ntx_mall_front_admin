<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品类别管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search" >
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.status" placeholder="请选择所属分类">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架" value=1></el-option>
          <el-option label="下架" value=0></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addAdvertise()">添加广告</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small"  :data="advertiseData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable :prop="'productDTO.name'" label="商品名" min-width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="productDTO.image" label="商品图片" width="220">
        <template slot-scope="scope">
          <div class="table-image">
            <el-image
              style="width: 160px; height: 90px"
              :src="scope.row.productDTO.mainImage"
              :preview-src-list="JSON.parse(scope.row.productDTO.subImages)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="productDTO.subtitle" label="商品副标题" width="120">
      </el-table-column>
      <el-table-column align="center" prop="productDTO.detail" label="详情" width="220">
        <template slot-scope="scope">
          <div>
            <el-button slot="reference" type="text"
                       style="color: gray;font-size: 13px" @click="showDetail(scope.row.productDTO.detail)">{{ scope.row.productDTO.detail.slice(0, 20) + '...' }}</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="productDTO.price" label="价格" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="productDTO.stock" label="库存" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status=== 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="gmtCreate" label="创建时间" width="220">
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="dialogVisible"
      @close="dialogVisible = false"
      width="80%">
      <div v-html="dialogContent"></div>
    </el-dialog>
    <!--    新增分类-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddAdvertiseForm" :model="editAddAdvertiseForm" :rules="rulesAdd">
        <el-select size="small" v-model="selectCategoryId" @change="queryAllProductByCategoryId()" placeholder="请选择所属分类">
          <el-option
            v-for="item in this.cateGoryList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
          <el-select size="small" v-model="editAddAdvertiseForm.productId" :disabled="queryCategory"  placeholder="请选择产品">
            <el-option
              v-for="item in this.productByCategoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddAdvertiseForm')">保存</el-button>
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
  name: "agent",
  data(){
    /* 定义初始化变量 */
    return{
      dialogVisible: false,
      dialogContent: '',
      queryCategory: true,
      productByCategoryList:[],
      selectCategoryId:'',
      cateGoryList:[],
      addFormVisible: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      advertiseData: [],
      nshow: true, //switch开启
      fshow: false, //switch关闭
      title1: '新增广告',
      editForm: {
        id:'',
        status: '',
      },
      editAddAdvertiseForm:{
        productId:''
      },
      rulesAdd:{
        productId: [
          {required: true, message: '商品不能为空', trigger: 'blur'}
        ],
      },
      formInline: {
        status:''
      }
    }
  },
  /* 定义事件函数 */
  methods:{
    showDetail(content){
      this.dialogVisible = true;
      this.dialogContent = content;
    },
    submitAddForm(formName){
      this.$axios.post("/advertise/addAdvertise", this.editAddAdvertiseForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    addAdvertise(){
      this.addFormVisible = true
      this.queryAllCategory()
    },
    closeDialog() {
      this.addFormVisible = false
    },
    editStatus(row) {
      this.editForm.id = row.id
      let status = row.status
      if (status === 1) {
        this.editForm.status = 0
      } else {
        this.editForm.status = 1
      }
      this.$axios.put('/advertise/updateStatus', this.editForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success("修改成功")
          this.queryAll()
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },
    search(){
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get('/advertise/getAdvertise', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          status: this.formInline.status,
        }
      }).then(res => {
        this.advertiseData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
      })
    },
    queryAllCategory() {
      this.$axios.get('/category/queryAllCategory').then(res => {
        this.cateGoryList = res.data.data
      })
    },
    queryAllProductByCategoryId(){
      this.productByCategoryList = []
      this.$axios.get('/product/queryAllProductByCategoryId/' + this.selectCategoryId).then(res => {
        this.productByCategoryList = res.data.data
        this.editAddAdvertiseForm.productId = ''
        this.queryCategory = false
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
