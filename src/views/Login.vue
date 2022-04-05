<template>
  <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px"
           class="demo-ruleForm login-container">
    <div class="title h2">
      <h2>StarBlog</h2>
      <h4>管理后台登录</h4>
    </div>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-button type="warning" plain class="w-100" @click="reset">重 置</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" class="w-100" @click="login" :loading="loading">登 录</el-button>
        </el-col>
      </el-row>
    </el-form-item>
  </el-form>
</template>

<script>
import * as auth from '@/utils/auth'

export default {
  name: "Login",
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: '',
      },
      fieldRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        password: [{required: true, message: '请输入密码', trigger: 'blur'}]
      },
    }
  },
  methods: {
    login() {
      this.loading = true
      this.$api.auth.login(this.loginForm)
        .then(res => {  // 调用登录接口
          // 保存登录信息
          auth.login(res.data.token, this.loginForm.username, res.data.expiration)

          // 登录成功，跳转到主页
          this.$message.success('登录成功')
          this.$router.push('/')
        })
        .catch(err => this.$message.error(`登录失败：${err.message}`))
        .finally(() => this.loading = false)
    },
    reset() {
      this.$refs.loginForm.resetFields()
    }
  },
}
</script>

<style lang="scss" scoped>
.login-container {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  background-clip: padding-box;
  margin: 100px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;

  .title {
    margin: 0px auto 30px auto;
    text-align: center;
    color: #505458;
  }
}
</style>
