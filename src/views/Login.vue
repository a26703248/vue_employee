<template>
  <div id="login-container">
    <el-row :gutter="24" justify="center">
      <el-col :span="3" :offset="10" class="logo-col">
        <el-image class="login-logo" :src="VueLogo" />
      </el-col>
      <el-col :span="10"/>
      <el-col :span="3">
        <el-form
          ref="loginFormRef"
          label-position="top"
          :model="loginForm"
          :rules="loginRules"
          label-width="50px"
          class="demo-ruleForm"
          status-icon
        >
          <el-form-item label="帳號" prop="username">
            <el-input v-model="loginForm.username" />
          </el-form-item>
          <el-form-item label="密碼">
            <el-input v-model="loginForm.password"  type="password" show-password/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm(loginFormRef)">
              登入
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router'
import VueLogo from "@/assets/logo.svg"
import {useJwtStore} from "@/stores/token.js"

const router = useRouter();
const loginFormRef = ref();
const loginForm = reactive({
  username: '',
  password: '',
})

const loginRules = reactive({
  username: [
    { required: true, message: '請輸入帳號', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
  ],
})
const instance = getCurrentInstance();

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
  // TODO 帳號訊息帶出測試
    if (valid) {
      router.push("/index");
    // TODO 待測試
      // instance.proxy.$request.post("/login", res => {
      //   const jwt = useJwtStore();
      //   jwt.setJwtToken(res.headers["authorization"]);
      //   router.push("/index");
      // })

    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<style>
#login-container {
  background-image: url("@/assets/login-background.jpg");
  background-repeat: no-repeat;
  padding-top: 200px;
  height:100vh;
  background-size: cover;
}

.login-logo {
  width: 200px;
  height: auto;
  margin-bottom: 50px;
}

.el-form-item:nth-child(3) .el-form-item__content {
  justify-content: center;
}
</style>
