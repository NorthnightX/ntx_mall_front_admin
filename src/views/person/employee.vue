<template>
  <div class="employee">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>员工管理</el-breadcrumb-item>
    </el-breadcrumb>
<!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.status" placeholder="请选择帐号状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="已锁定" value="2"></el-option>
        </el-select>
        <el-select size="small" v-model="formInline.administratorType" placeholder="请选择部门">
          <el-option label="全部" value=""></el-option>
          <el-option label="运维人员" value="2"></el-option>
          <el-option label="系统管理员" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.username" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="queryByName()">搜索</el-button>
      </el-form-item>
    </el-form>
<!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="userData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="account" label="员工账号" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="password" label="密码" width="260">
      </el-table-column>
      <el-table-column align="center"
        label="员工类型">
        <template slot-scope="scope">
          <div>
            {{
                parseInt(scope.row.administratorType) === 1 ? '系统管理员' : '运维人员'
            }}
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status === '1' ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteEmployee(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="用户名" prop="username">
          <el-input size="small" v-model="editForm.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="员工类型" prop="roleId">
          <el-select size="small" v-model="editForm.roleId" placeholder="请选择" class="userRole">
            <el-option label="系统管理员" value="1"></el-option>
            <el-option label="运维人员" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editForm')">保存</el-button>
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
import {userDelete, userLock} from "../../api/userMG";

export default {
  name: "employee",
  data(){
    /* 定义初始化变量 */
    return{
      nshow: true, //switch开启
      fshow: false, //switch关闭
      title: '添加用户',
      editFormVisible: false,
      editForm: {
        id:'',
        status: '',
      },
      formInline: {
        username: '',
        status: '',
        administratorType: ''
      },
      userData:[

      ]
    }
  },
  /* 定义事件函数 */
  methods:{
    closeDialog(){
      this.editFormVisible = false
    },
    handleEdit(){
      this.editFormVisible = true
    },
    editStatus(row) {
      this.editForm.id = row.id
      let status = row.status
      if (status == '1') {
        this.editForm.status = '0'
      } else {
        this.editForm.status = '1'
      }
      this.$axios.put('/admin/updateAdmin', this.editForm).then(res => {
        if (res.data.code === 200) {
          this.$message.success("修改成功")
          this.queryAll()
        } else {
          this.$message.error(res.data.data)
        }
      })
    },
    queryByName() {
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get('/admin/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.formInline.username,
          status: this.formInline.status,
          administratorType: this.formInline.administratorType
        }
      }).then(res => {
        this.userData = res.data.data.records
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
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>

