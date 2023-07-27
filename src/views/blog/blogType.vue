<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客类型管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="search">
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="输入类型名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="add()">添加</el-button>
      </el-form-item>
    </el-form>

    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="typeData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="类型名称" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status=== 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949"
                     @change="editStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="deleted" label="是否删除" width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.deleted=== 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949"
                     @change="editDeleted(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="gmtCreate" label="创建时间" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="gmtModified" label="修改时间" width="150">
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="editDeleted(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAgentForm" :model="editTypeForm" :rules="rules">
        <el-form-item label="类型名" prop="name">
          <el-input size="small" v-model="editTypeForm.name" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select size="small" v-model="editTypeForm.status" placeholder="请选择" class="userRole">
            <el-option label="正常" :value=1></el-option>
            <el-option label="封禁" :value=0></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否删除" prop="deleted">
          <el-select size="small" v-model="editTypeForm.deleted" placeholder="请选择" class="userRole">
            <el-option label="正常" :value=1></el-option>
            <el-option label="封禁" :value=0></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editTypeForm')">保存</el-button>
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
  name: "blogType",
  data(){
    /* 定义初始化变量 */
    return {
      nshow: true,
      fshow: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      formInline: {
        name: ""
      },
      typeData: "",
      editTypeForm: {
        id:"",
        status: "",
        deleted:""
      },
      editFormVisible:false
    }
  },
  /* 定义事件函数 */
  methods:{
    closeDialog(){
      this.editFormVisible = false
    },
    handleEdit(blogType){
      this.editFormVisible = true
      this.editTypeForm = {...blogType}

    },
    submitForm(formName) {
      console.log(this.editBlogForm);
      this.$axios.put("blogType/updateBlogType", this.editTypeForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.pageNum = 1
          this.queryAll()
          this.$message.success("修改成功");
        } else {
          this.$message.warning("网络异常")
        }
      })
    },
    editStatus(blogType) {
      this.$confirm('确定要修改吗?', '信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editTypeForm.id = blogType.id
        this.editTypeForm.deleted = blogType.deleted
        if (blogType.status === 1) {
          this.editTypeForm.status = 0
        } else {
          this.editTypeForm.status = 1
        }
        this.$axios.put("blogType/updateBlogType", this.editTypeForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success("修改成功");
            this.queryAll()
          } else {
            this.$message.warning("网络异常")
          }
        })
      })
    },
    editDeleted(blogType) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editTypeForm.id = blogType.id
        this.editTypeForm.status = blogType.status
        if (blogType.deleted === 1) {
          this.editTypeForm.deleted = 0
        } else {
          this.editTypeForm.deleted = 1
        }
        this.$axios.put("blogType/updateBlogType", this.editTypeForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success("修改成功");
            this.queryAll()
          } else {
            this.$message.warning("网络异常")
          }
        })
      })
    },
    search(){
      this.pageNum = 1;
      this.queryAll()
    },
    queryAll() {
      this.$axios.get("blogType/queryTypePage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          name: this.formInline.name
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.typeData = res.data.data.records
          this.total = res.data.data.total
        } else {
          this.$message.warning(res.data.message)
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
