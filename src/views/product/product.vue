<template>
  <div class="agent">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--条件查询-->
    <el-form :inline="true" :model="formInline" class="user-search" v-show="!showDeleteButton">
      <el-form-item label="搜索：">
        <el-select size="small" v-model="formInline.categoryId" placeholder="请选择所属分类">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in this.cateGoryInitialList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-input size="small" v-model="formInline.name" placeholder="输入商品名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" icon="el-icon-circle-plus" @click="addProduct()">添加商品</el-button>
      </el-form-item>
    </el-form>
    <!--列表-->
    <el-table size="small" @selection-change="selectChange" :data="productData" highlight-current-row
              border element-loading-text="拼命加载中" style="width: 100%;">
      <el-table-column align="center" type="selection" width="50">
      </el-table-column>
      <el-table-column align="center" sortable prop="categoryName" label="分类名" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="商品名" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="name" label="商品图片" width="220">
        <template slot-scope="scope">
          <div class="table-image">
            <el-image
              style="width: 160px; height: 90px"
              :src="scope.row.mainImage"
              :preview-src-list="JSON.parse(scope.row.subImages)">
            </el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="subtitle" label="商品副标题" width="120">
      </el-table-column>
      <el-table-column align="center" prop="detail" label="详情" width="220">
        <template slot-scope="scope">
          <div>
            <el-button slot="reference" type="text"
                       style="color: gray;font-size: 13px" @click="showDetail(scope.row.detail)">
              {{ scope.row.detail.slice(0, 20) + '...' }}
            </el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" sortable prop="price" label="价格" width="120">
      </el-table-column>
      <el-table-column align="center" sortable prop="stock" label="库存" width="220">
      </el-table-column>
      <el-table-column align="center" sortable prop="status" label="状态" min-width="150">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status=== 1 ? nshow : fshow" active-color="#13ce66" inactive-color="#ff4949"
                     @change="editStatus(scope.row)">
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
          <el-button size="mini" type="danger" @click="deleteProduct(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible="dialogVisible"
      @close="dialogVisible = false"
      width="80%">
      <div v-html="dialogContent"></div>
    </el-dialog>
    <!-- 修改商品信息 -->
    <el-dialog :title="title" :visible.sync="editFormVisible" width="80%" @close='closeDialog("edit")'>
      <el-form label-width="100px" ref="editProductForm" :model="editProductForm" :rules="rules">
        <el-form-item label="商品名" prop="name">
          <el-input size="small" v-model="editProductForm.name" auto-complete="off"
                    placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="subImages">
          <el-upload
            name="image"
            action="http://localhost:10100/upload/uploadMallImage"
            :headers=headers
            list-type="picture-card"
            :file-list="subImageList"
            :on-success="handleUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select size="small" v-model="initialCategoryId" @change="queryChildCategory()" placeholder="请选择">
            <el-option
              v-for="item in this.cateGoryInitialList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select size="small" :disabled="categoryDisable" v-model="editProductForm.categoryId" placeholder="请选择">
            <el-option
              v-for="item in this.cateGoryChildList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品副标题" prop="subtitle">
          <el-input size="small" v-model="editProductForm.subtitle" auto-complete="off"
                    placeholder="请输入商品副标题"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="detail">
          <mavon-editor
            v-model="editProductForm.detail"
            ref=md
            @imgAdd="$imgAdd"></mavon-editor>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input type="number" size="small" v-model="editProductForm.price" auto-complete="off"
                    placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input type="number" size="small" v-model="editProductForm.stock" auto-complete="off"
                    placeholder="请输入商品库存"></el-input>
        </el-form-item>
        <el-form-item label="分类状态" prop="status">
          <el-select size="small" v-model="editProductForm.status" placeholder="请选择">
            <el-option label="正常" :value=1></el-option>
            <el-option label="停用" :value=0></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" class="title" @click="submitForm('editProductForm')">
          保存
        </el-button>
      </div>
    </el-dialog>
    <!--    新增商品-->
    <el-dialog :title="title1" :visible.sync="addFormVisible" width="80%" @close='closeDialog("edit")'>
      <el-form label-width="120px" ref="editProductForm" :model="editAddProductForm" :rules="rules">
        <el-form-item label="商品名" prop="name">
          <el-input size="small" v-model="editAddProductForm.name" auto-complete="off"
                    placeholder="请输入商品名"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="subImages">
          <el-upload
            v-model="uploadImagesList"
            name="image"
            action="http://localhost:10100/upload/uploadMallImage"
            :headers=headers
            list-type="picture-card"
            :on-success="handleUploadSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="所属分类" prop="categoryId">
          <el-select size="small" v-model="initialCategoryId" @change="queryChildCategory()" placeholder="请选择">
            <el-option
              v-for="item in this.cateGoryInitialList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select size="small" v-model="editAddProductForm.categoryId" :disabled="categoryDisable"
                     placeholder="请选择">
            <el-option
              v-for="item in this.cateGoryChildList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品副标题" prop="subtitle">
          <el-input size="small" v-model="editAddProductForm.subtitle" auto-complete="off"
                    placeholder="请输入商品副标题"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="detail">
          <mavon-editor
            v-model="editAddProductForm.detail"
            ref=md
            @imgAdd="$imgAdd"></mavon-editor>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input type="number" size="small" v-model="editAddProductForm.price" auto-complete="off"
                    placeholder="请输入商品价格"></el-input>
        </el-form-item>
        <el-form-item label="商品库存" prop="stock">
          <el-input type="number" size="small" v-model="editAddProductForm.stock" auto-complete="off"
                    placeholder="请输入商品库存"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click='closeDialog("edit")'>取消</el-button>
        <el-button size="small" type="primary" class="title"
                   @click="submitAddForm('editAddProductForm')">保存
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
import MarkdownIt from 'markdown-it';
export default {
  name: "agent",
  data() {
    /* 定义初始化变量 */
    return {
      initialCategoryId: '',
      categoryDisable: true,
      dialogContent: '',
      uploadImagesList: [],
      subImageList: [],
      headers: {
        'authorization': localStorage.getItem('token'),
        // 'Content-Type': 'multipart/form-data'
      },
      dialogImageUrl: '',
      dialogVisible: false,
      addFormVisible: false,
      showDeleteButton: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      ids: [],
      productData: [],
      nshow: true, //switch开启
      fshow: false, //switch关闭
      title: '商品修改',
      title1: '新增商品',
      editFormVisible: false,
      editForm: {
        id: '',
        status: '',
      },
      editAddProductForm: {
        name: '',
        subImages: '',
        categoryId: '',
        subtitle: '',
        detail: '',
        price: '',
        stock: ''
      },
      rules: {
        name: [
          {required: true, message: '商品名不能为空', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '所属分类不能为空', trigger: 'blur'}
        ],
        status: [
          {required: true, message: '请选择状态', trigger: 'blur'}
        ],
        stock: [
          {required: true, message: '库存不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '价格不能为空', trigger: 'blur'}
        ],
        detail: [
          {required: true, message: '请输入商品介绍', trigger: 'blur'}
        ],
        subtitle: [
          {required: true, message: '请输入商品副标题', trigger: 'blur'}
        ]
      },
      rulesAdd: {
        name: [
          {required: true, message: '商品名不能为空', trigger: 'blur'}
        ],
        categoryId: [
          {required: true, message: '所属分类不能为空', trigger: 'blur'}
        ],
        stock: [
          {required: true, message: '库存不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '价格不能为空', trigger: 'blur'}
        ],
        detail: [
          {required: true, message: '请输入商品介绍', trigger: 'blur'}
        ],
        subtitle: [
          {required: true, message: '请输入商品副标题', trigger: 'blur'}
        ]
      },
      cateGoryInitialList: [],
      cateGoryChildList: [],
      editProductForm: {
        id: '',
        subImages: '',
        status: '',
        name: '',
        categoryId: '',
        subtitle: '',
        detail: '',
        price: '',
        stock: ''
      },
      formInline: {
        categoryId: '',
        name: ''
      }
    }
  },
  /* 定义事件函数 */
  methods: {
    renderMarkdown(content) {
      const md = new MarkdownIt();
      return md.render(content);
    },
    queryChildCategory() {
      this.$axios.get('/category/queryChildCategory', {params: {id: this.initialCategoryId}}).then(res => {
        this.editAddProductForm.categoryId = ''
        this.editProductForm.categoryId = ''
        this.cateGoryChildList = res.data.data
        this.categoryDisable = false
      })
    },
    showDetail(content) {
      this.dialogVisible = true;
      // this.dialogContent = content;
      this.dialogContent = this.renderMarkdown(content);
    },
    handleUploadSuccess(response, file, fileList) {
      const uploadedImageUrl = response.data;
      this.uploadImagesList.push(uploadedImageUrl);
    },
    handleRemove(file, fileList) {
      const removedUrl = file.url;
      const index = this.uploadImagesList.findIndex(url => url === removedUrl);
      if (index !== -1) {
        this.uploadImagesList.splice(index, 1);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    $imgAdd(pos, $file) {
      var formdata = new FormData();
      formdata.append('image', $file);
      this.$axios.post("upload/uploadMallImage", formdata).then(res => {
        if (res.status === 200) {
          var url = res.data.data;
          this.$refs.md.$img2Url(pos, url)
        } else {
          this.$message("网络异常")
        }
      })
    },
    submitAddForm(formName) {
      this.editAddProductForm.subImages = JSON.stringify(this.uploadImagesList)
      this.$axios.post("/product/addProduct", this.editAddProductForm).then(res => {
        if (res.data.code === 200) {
          this.addFormVisible = false
          this.categoryDisable = true
          this.queryAll()
          this.cleanAddForm()
          this.$message.success("新增成功")
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    cleanAddForm() {
      this.editAddProductForm.name = ''
      this.editAddProductForm.subImages = ''
      this.editAddProductForm.categoryId = ''
      this.editAddProductForm.subtitle = ''
      this.editAddProductForm.detail = ''
      this.editAddProductForm.price = ''
      this.editAddProductForm.stock = ''
      this.initialCategoryId = ''
    },
    addProduct() {
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
      this.editProductForm.subImages = JSON.stringify(this.uploadImagesList);
      this.$axios.put("/product/updateProduct", this.editProductForm).then(res => {
        if (res.data.code === 200) {
          this.editFormVisible = false
          this.editProductForm = {}
          this.queryAll()
          this.$message.success("修改成功")
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    allCategory(){
      this.$axios.get('/category/queryAllCategory').then(res => {
        this.editAddProductForm.categoryId = ''
        this.cateGoryChildList = res.data.data
      })
    },
    handleEdit(product) {
      this.editFormVisible = true
      this.subImageList = JSON.parse(product.subImages).map(imageUrl => ({
        name: 'subImage',
        url: imageUrl,
      }));
      this.allCategory()
      this.uploadImagesList = JSON.parse(product.subImages)
      this.editProductForm = {...product}
    },
    deleteProduct(id) {
      this.$confirm('确定要删除吗?', '信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除
        this.$axios.delete("/product/deleteProduct?id=" + id).then(res => {
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
      this.categoryDisable = true
      this.subImageList = []
      this.dialogImageUrl = ''
      this.uploadImagesList = []
      this.cleanAddForm()
    },
    editStatus(row) {
      this.editForm.id = row.id
      let status = row.status
      if (status === 1) {
        this.editForm.status = 0
      } else {
        this.editForm.status = 1
      }
      this.$axios.put('/product/updateProductStatus', this.editForm).then(res => {
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
    queryAllInitialCategory() {
      this.$axios.get('/category/queryInitialCategory').then(res => {
        this.cateGoryInitialList = res.data.data
      })
    },
    queryAll() {
      this.$axios.get('/product/queryAll', {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          categoryId: this.formInline.categoryId,
          name: this.formInline.name,
        }
      }).then(res => {
        this.productData = res.data.data.records
        this.pageNum = res.data.data.current
        this.total = res.data.data.total
        this.subImageList = []
        this.dialogImageUrl = ''
        this.uploadImagesList = []

      })
    }
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.queryAll()
    this.queryAllInitialCategory()
  }
}
</script>

<!-- scoped此属性可以防止当前页面的样式不会影响其他页面样式 -->
<style scoped>

</style>
