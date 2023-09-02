<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品类别管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search" v-show="!showDeleteButton">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.parentId" placeholder="请选择所属分类">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in this.initialForm"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="输入分类名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addCategory()">添加分类</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="categoryData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="parentName" label="父分类名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="分类名" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status=== 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="gmtCreate" label="创建时间" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="gmtModified" label="修改时间" width="220">
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 修改分类 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editCategoryForm" :model="editCategoryForm" :rules="rules">
        <el-form-item label="分类名" prop="name">
          <el-input size="small" v-model="editCategoryForm.name" auto-complete="off" placeholder="请输入分类名"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="parentId">
          <el-select size="small" v-model="editCategoryForm.parentId" placeholder="请选择">
            <el-option label="基础分类" :value=0></el-option>
            <el-option
              v-for="item in this.initialForm"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类状态" prop="status">
          <el-select size="small" v-model="editCategoryForm.status" placeholder="请选择">
            <el-option label="正常" :value=1></el-option>
            <el-option label="停用" :value=0></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editCategoryForm')">保存</el-button>
      </div>
    </el-dialog>
    <!--    新增分类-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAddCategoryForm" :model="editAddCategoryForm" :rules="rulesAdd">
        <el-form-item label="分类名" prop="username">
          <el-input size="small" v-model="editAddCategoryForm.name" auto-complete="off" placeholder="请输入分类名"></el-input>
        </el-form-item>
        <el-form-item label="所属分类" prop="parentId">
          <el-select size="small" v-model="editAddCategoryForm.parentId" placeholder="请选择">
            <el-option label="基础分类" :value=0></el-option>
            <el-option
              v-for="item in this.initialForm"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitAddForm('editAddCategoryForm')">保存</el-button>
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
      addFormVisible: false,
      showDeleteButton: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ids: [],
      categoryData: [],
      nshow: true, //switch开启
      fshow: false, //switch关闭
      title: '分类修改',
      title1: '新增分类',
      editFormVisible: false,
      editForm: {
        id:'',
        status: '',
      },
      editAddCategoryForm:{
        name:'',
        parentId:''
      },
      rules: {
        name: [
          {required: true, message: '分类名不能为空', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: '所属分类不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ]
      },
      rulesAdd:{
        name: [
          {required: true, message: '分类名不能为空', trigger: 'blur'}
        ],
        parentId: [
          {required: true, message: '所属分类不能为空', trigger: 'blur'}
        ]
      },
      initialForm:[],
      editCategoryForm: {
        id:'',
        status:'',
        name:'',
        parentId:''
      },
      formInline: {
        parentId:'',
        name:''
      }
    }
  },
  /* 定义事件函数 */
  methods:{
    submitAddForm(formName){
      this.$axios.post("/category/addCategory", this.editAddCategoryForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.queryAll()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    addCategory(){
      this.addFormVisible = true
    },
    selectChange(val) {
      this.ids = []
      val.forEach((item, index) => {
        this.ids.push(item.id)
      })
      if (this.ids.length > 0) {
        this.showDeleteButton = true
      } else {
        this.showDeleteButton = false
      }
    },
    closeDeleteButton() {
      this.ids = []
      this.showDeleteButton = false
      this.queryAll()
    },
    submitForm(formName) {
      this.$axios.put("/category/updateCategory", this.editCategoryForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleEdit(category) {
      this.editFormVisible = true
      this.editCategoryForm = {...category}
    },
    deleteCategory(id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/category/deleteCategory?id=" + id).then(res => {
          if (res.data.code === 200) {
            this.pageNum = 1
            this.pageSize = 10
            this.queryAll()
            this.$message.success("删除成功")
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除！'
          })
        })
    },
    closeDialog() {
      this.editFormVisible = false
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
      this.$axios.put('/category/updateCategoryStatus', this.editForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success("修改成功")
          this.queryAll()
        } else {
          this.$message.error(res.data.message)
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
    queryInitialCategory(){
      this.$axios.get('/category/queryInitialCategory').then(res => {
        this.initialForm = res.data.data
      })
    },
    queryAll() {
      this.$axios.get('/category/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          parentId: this.formInline.parentId,
          name: this.formInline.name,
        }
      }).then(res => {
        this.categoryData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
      })
    }
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
    this.queryInitialCategory()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
