<template>
  <div class="login">
    <!-- :model="ruleForm" :rules="rules" ref="ruleForm" -->
    <el-form  label-position="top" class="login-form" :model="form" :rules="rules" ref="form"  label-width="80px">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')" class="login-btn" :loading="isLoding">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { login } from '@/services/user'
import { Form } from 'element-ui'

export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      isLoding: false,
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async onSubmit (formName: string) {
      try {
        // 表单验证
        await (this.$refs[formName] as Form).validate()
        this.isLoding = true
        // 验证通过 -> 提交
        const { data } = await login(this.form)
        // 处理请求结果
        //   ---失败：给出提示
        if (data.state !== 1) {
          return this.$message.error({
            message: data.message
          })
        } else {
          // 登录成功，记录登录状态，状态需要能够全局访问（放到Vuex）
          this.$store.commit('setUser', data.content)
          //   ---成功：去到首页
          this.$router.push(this.$route.query.redirect as string || '/')
          // this.$router.push({
          //   name: 'home'
          // })
          this.$message({
            message: data.message,
            type: 'success'
          })
        }
        this.isLoding = false
      } catch (err) {
        console.log('登录失败', err)
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn {
    width: 100%;
  }
}
</style>
