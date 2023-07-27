<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>博客管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search" v-show="!showDeleteButton">
      <el-form-item label="搜索：">
        <el-select size="small" clearable v-model="formInline.typeId" placeholder="请选择博客类型">
          <el-option
            v-for="(key, value) in typeData"
            :key="value"
            :label="key"
            :value="value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.title" placeholder="输入博客标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="blogData" highlight-current-row v-loading="loading"
              border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="title" label="标题" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="image" label="博客头图" width="220">
        <template slot-scope="scope">
          <img :src="scope.row.image" alt="博客头图" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="content" label="博客内容" width="250">
        <template slot-scope="scope">
          <el-button type="text" @click="openDialog(scope.row.content, scope.row.title)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="clickCount" label="点击量" width="150">
      </el-table-column>
      <el-table-column align="center" sortable prop="typeId" label="博客类型" width="150">
        <template slot-scope="scope">
          {{ scope.row.typeName }}
        </template>
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
<!--展示博客详情-->
    <el-dialog
      :visible="dialogVisible"
      :title="dialogTitle"
      @close="dialogVisible = false"
      width="80%">
      <div v-html="dialogContent"></div>
    </el-dialog>
    <!-- 编辑界面 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="100%" @click='closeDialog("edit")'>
      <el-form label-width="80px" ref="editAgentForm" :model="editBlogForm" :rules="rules">
        <el-form-item label="标题" prop="title">
          <el-input size="small" v-model="editBlogForm.title" auto-complete="off" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="博客封面" prop="image">
          <el-form-item>
            <el-upload
              class="upload-demo"
              action="http://localhost:10100/upload/uploadImage"
              list-type="picture-card"
              name="file"
              :limit="1"
              :file-list="fileList"
              :on-success="coverSuccess"
              :on-preview = 'coverPreview'>
              <i slot="default" class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="BigCoverVisible">
              <img width="100%" :src="editBlogForm.image">
            </el-dialog>
          </el-form-item>
        </el-form-item>
        <el-form-item label="博客类型" prop="typeId">
          <el-select v-model="editBlogForm.typeId" placeholder="请选择">
            <el-option
              v-for="(key, value) in typeData"
              :key=value
              :label=key
              :value=parseInt(value)>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <template>
            <quill-editor
              class="ql-editor"
              v-model="editBlogForm.content"
              ref="myQuillEditor"
              :options="editorOption"
              @blur="onEditorBlur($event)"
              @focus="onEditorFocus($event)"
              @change="onEditorChange($event)">
            </quill-editor>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" :loading="loading" class="title" @click="submitForm('editBlogForm')">
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
  name: "blog",
  data() {
    /* 定义初始化变量 */
    return {
      dialogVisible: false,
      dialogTitle: '',
      dialogContent: '',
      fileList: [],
      BigCoverVisible: false,
      // 富文本编辑器配置
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // 加粗 斜体 下划线 删除线
            ['blockquote', 'code-block'], // 引用  代码块
            [{header: 1}, {header: 2}], // 1、2 级标题
            [{list: 'ordered'}, {list: 'bullet'}], // 有序、无序列表
            [{script: 'sub'}, {script: 'super'}], // 上标/下标
            [{indent: '-1'}, {indent: '+1'}], // 缩进
            [{direction: 'rtl'}], // 文本方向
            [{size: ['12px', false, '16px', '18px', '20px', '30px']}], // 字体大小
            [{header: [1, 2, 3, 4, 5, 6, false]}], // 标题
            [{color: []}, {background: []}], // 字体颜色、字体背景颜色
            [{font: [false, 'SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial']}], // 字体种类
            [{align: []}], // 对齐方式
            ['clean'], // 清除文本格式
            ['link', 'image', 'video']] // 链接、图片、视频
        },
        placeholder: '请输入正文'
      },
      title: "修改",
      nshow: true,
      fshow: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      editFormVisible: false,
      formInline: {
        typeId: "",
        title: ""
      },
      imageUrl: '',
      editBlogForm: {
        id: "",
        deleted: "",
        status: "",

      },
      blogData: [],
      typeData: [],
    }
  },
  /* 定义事件函数 */
  methods: {
    openDialog(content, title) {
      this.dialogTitle = title;
      this.dialogContent = content;
      this.dialogVisible = true;
    },
    coverSuccess(response){
      this.editBlogForm.image = response.data
    },
    coverPreview(file){
      this.BigCoverVisible = true
    },

    // 失去焦点事件
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    // 内容改变事件
    onEditorChange({quill, html, text}) {
      this.content = html
    },
    submitForm(formName) {
      console.log(this.editBlogForm);
      this.$axios.put("blog/updateBlog", this.editBlogForm).then(res => {
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
    closeDialog() {
      this.editFormVisible = false
      this.fileList = []
    },
    handleEdit(blog) {
      this.editBlogForm = {...blog}
      this.editFormVisible = true
    },
    editStatus(blog) {
      this.$confirm('确定要修改吗?', '信息', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editBlogForm.id = blog.id
        this.editBlogForm.deleted = blog.deleted
        if (blog.status === 1) {
          this.editBlogForm.status = 0
        } else {
          this.editBlogForm.status = 1
        }
        this.$axios.put("blog/updateBlog", this.editBlogForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success("修改成功");
            this.queryAll()
          } else {
            this.$message.warning("网络异常")
          }
        })
      })
    },
    editDeleted(blog) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editBlogForm.id = blog.id
        this.editBlogForm.status = blog.status
        if (blog.deleted === 1) {
          this.editBlogForm.deleted = 0
        } else {
          this.editBlogForm.deleted = 1
        }
        this.$axios.put("blog/updateBlog", this.editBlogForm).then(res => {
          if (res.data.code === 200) {
            this.$message.success("修改成功");
            this.queryAll()
          } else {
            this.$message.warning("网络异常")
          }
        })
      })
    },
    open(content, title) {
      this.$alert(content, title, {
        dangerouslyUseHTMLString: true
      });
    },
    search() {
      this.pageNum = 1
      this.queryAll();
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.queryAll();
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.queryAll()
    },

    queryAll() {
      this.$axios.get("blog/getBlogPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          typeId: this.formInline.typeId,
          title: this.formInline.title
        }
      }).then(res => {
        if (res.data.code === 200) {
          this.blogData = res.data.data.records
          this.total = res.data.data.total
          this.fileList = []
          console.log(this.blogData)
        } else {
          this.$message.warning(res.data.message)
        }
      })
    },
    getAllType() {
      this.$axios.get("blogType/queryAllType").then(res => {
        if (res.data.code === 200) {
          this.typeData = res.data.data;
        } else {
          this.$message.warning("网络异常")
        }
      })
    }
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.getAllType()
    this.queryAll()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

</style>
