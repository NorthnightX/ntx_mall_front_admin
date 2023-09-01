<template>
  <div class="login-wrap">
    <el-card class="loginCord">
      <div class="loginTitle">登录</div>
      <el-form :model="loginForm" ref="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.userName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="loginForm.verification">
            <div class="codeClass" slot="append">
              <div>
                <img @click="getCode" width="80px" :src="url">
              </div>
              <div v-show="time >= 0">{{ time }}S</div>
              <div v-show="time < 0">请刷新</div>
            </div>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="loginButton" type="primary" @click="login('loginForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import router from "../router";

export default {
  name: "",
  data() {
    /* 定义初始化变量 */
    return {
      time: 60,
      interval: '',//定时器
      url: '',
      redisKey: '',
      loginRules: {
        userName: [{required: true, message: '请填写用户名', trigger: 'blur'}],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 12, message: '长度在 5 到 12 个字符', trigger: 'blur'}
        ],
        verification: [{required: true, message: '请输入验证码', trigger: 'blur'}]
      },
      loginForm: {
        userName: '',
        password: '',
        verification: '',
        redisKey: ''
      }
    }
  },
  /* 定义事件函数 */
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loginForm.redisKey = this.redisKey
          this.$axios.post('/user/adminLogin', this.loginForm).then(res => {
            if (res.data.code === 200) {
              this.$message.success("登陆成功")
              localStorage.setItem('token', res.data.data.token)
              localStorage.setItem('user', res.data.data.user)
              router.push("/user/user")
            } else {
              this.$message.error(res.data.message)
            }
          })
        } else {
          this.$message.error('请输入完整')
        }
      })
    },
    getCode() {
      clearInterval(this.interval)
      this.time = 60
      this.$axios.get('/user/getVerification').then(res => {
        if (res.data.code === 200) {
          this.url = res.data.data.base64Str
          this.redisKey = res.data.data.redisKey
          this.timeOut()
        } else {
          this.$message("验证码获取失败")
        }
      })
    },
    timeOut() {
      this.interval = setInterval(() => {
        if (this.time <= 0) {
          clearInterval(this.interval)
        }
        this.time = --this.time
      }, 1000)
    },
    toReg() {
      this.$router.push('/reg')
    },
  },
  /* vue的生命周期函数
     当页面加载完毕就会执行created里面的函数
  */
  created() {
    this.getCode()
  }
}
</script>

<style scoped>
.login-wrap {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  background-image: url("../assets/img/background.jpg");
  background-repeat: no-repeat;
  background-position: center right;
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loginCord {
  width: 25%;
  height: 400px;
}

.loginTitle {
  text-align: center;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

.loginButton {
  width: 100%;
}

.regButton {
  margin-left: -10px !important;
}

.codeClass {
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
