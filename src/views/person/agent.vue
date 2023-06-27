<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>代理管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.isLock" placeholder="请选择帐号状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="N"></el-option>
          <el-option label="已锁定" value="Y"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.userName" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="userData" highlight-current-row v-loading="loading" border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="userName" label="用户名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="userName" label="代理账号" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="userName" label="资格号" width="250">
      </el-table-column>
      <el-table-column align="center" sortable prop="userName" label="代理等级" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="isLock" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.isLock=='N'?nshow:fshow" active-color="#13ce66" inactive-color="#ff4949" @change="editType(scope.$index, scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.$index, scope.row)">删除</el-button>
          <el-button size="mini" type="success" @click="resetpwd(scope.$index, scope.row)">重置密码</el-button>
          <el-button size="mini" type="success" @click="dataAccess(scope.$index, scope.row)">数据权限</el-button>
          <el-button size="mini" type="success" @click="offlineUser(scope.$index, scope.row)">下线</el-button>
          <el-button size="mini" type="success" @click="refreshCache(scope.$index, scope.row)">刷新缓存</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editForm" :model="editForm" :rules="rules">
        <el-form-item label="用户名" prop="userName">
          <el-input size="small" v-model="editForm.userName" auto-complete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="userRealName">
          <el-input size="small" v-model="editForm.userRealName" auto-complete="off" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select size="small" v-model="editForm.roleId" placeholder="请选择" class="userRole">
            <el-option label="公司管理员" value="1"></el-option>
            <el-option label="普通用户" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="userMobile">
          <el-input size="small" v-model="editForm.userMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮件" prop="userEmail">
          <el-input size="small" v-model="editForm.userEmail" placeholder="请输入邮箱地址"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio v-model="editForm.userSex" label="男">男</el-radio>
          <el-radio v-model="editForm.userSex" label="女">女</el-radio>
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
export default {
  name: "agent",
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
        page: 1,
        limit: 10,
        deptId: '',
        userName: '',
        userMobile: '',
        isLock: ''
      }
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
