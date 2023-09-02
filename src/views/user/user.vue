<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.status" placeholder="请选择帐号状态">
          <el-option label="全部" value=""></el-option>
          <el-option label="正常" value="1"></el-option>
          <el-option label="已锁定" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select size="small" v-model="formInline.role" placeholder="请选择用户角色">
          <el-option label="全部" value=""></el-option>
          <el-option label="管理员" value=0></el-option>
          <el-option label="普通用户" value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.username" placeholder="输入用户名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="userData" highlight-current-row v-loading="loading"
              border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="username" label="用户名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="nickName" label="用户昵称" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="role" label="用户身份" width="250">
        <template slot-scope="scope">
          <template v-if="scope.row.role === 0">
            <!-- 显示管理员 -->
            管理员
          </template>
          <template v-else>
            <!-- 显示管理员 -->
            普通用户
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="email" label="邮箱" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="phone" label="电话" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status=== 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949"
                     @change="editStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="300">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
          <el-button size="mini" type="success" @click="resetpwd( scope.row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="30%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editUserForm" :model="editUserForm" :rules="rules">
        <el-form-item label="用户昵称" prop="nickName">
          <el-input size="small" v-model="editUserForm.nickName" auto-complete="off"
                    placeholder="请输入用户昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input size="small" v-model="editUserForm.phone" auto-complete="off"
                    placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input size="small" v-model="editUserForm.email" auto-complete="off"
                    placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select size="small" v-model="editUserForm.role" placeholder="请选择" class="userRole">
            <el-option label="管理员" :value=0></el-option>
            <el-option label="普通用户" :value=1></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select size="small" v-model="editUserForm.status" placeholder="请选择" class="userRole">
            <el-option label="正常" :value=1></el-option>
            <el-option label="封禁" :value=0></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editUserForm')">
          保存
        </el-button>
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
  data() {
    /* 定义初始化变量 */
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ids: [],
      userData: [],
      nshow: true, //switch开启
      fshow: false, //switch关闭
      title: '用户修改',
      editFormVisible: false,
      editForm: {
        id: '',
        status: '',
      },
      rules: {
        nickName: [
          {required: true, message: '用户昵称不能为空', trigger: 'blur'}
        ],
        role: [
          {required: true, message: '角色不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择帐号状态', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        email: [
          {required: true, message: '请输入邮箱', trigger: 'blur'}
        ]
      },
      editUserForm: {
        id: '',
        status: '',
        nickName: '',
        email: '',
        role:'',
        phone:''
      },
      formInline: {
        username: '',
        status: '',
        role: ''
      }
    }
  },
  /* 定义事件函数 */
  methods: {
    submitForm(formName) {
      this.$axios.put("/user/updateUser", this.editUserForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleEdit(user) {
      this.editFormVisible = true
      this.editUserForm = {...user}
    },
    deleteUser(id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/user/delete?id=" + id).then(res => {
          if (res.data.code === 200) {
            this.pageNum = 1
            this.pageSize = 10
            this.queryAll()
            this.$message.success("删除成功")
          } else {
            this.$message.error(res.data.message)
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
    resetpwd(id) {
      this.$confirm('确定要重置吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios.put("/user/updatePassword?id=" + id).then(res => {
          if (res.data.code === 200) {
            this.$message.success("重置成功")
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
    closeDialog() {
      this.editFormVisible = false
    },
    editStatus(row) {
      this.editForm.id = row.id
      let status = row.status
      if (status === 1) {
        this.editForm.status = 0
      } else {
        this.editForm.status = 1
      }
      this.$axios.put('/user/updateStatus', this.editForm).then(res => {
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
    search() {
      this.pageNum = 1
      this.queryAll()
    },
    queryAll() {
      this.$axios.get('/user/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.formInline.username,
          status: this.formInline.status,
          role: this.formInline.role
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
