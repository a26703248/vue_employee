<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <el-image class="login-logo" :src="VueLogo" />
    </el-col>
  </el-row>

  <el-row :gutter="24">
    <el-col>
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
        <el-form-item label="密碼" type="password" prop="password">
          <el-input v-model="loginForm.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(loginFormRef)">
            登入
          </el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
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
      instance.proxy.$request.post("/login", res => {
        const jwt = useJwtStore();
        jwt.setJwtToken(res.headers["authorization"]);
        router.push("/index");
      })

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
#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;

  font-weight: normal;
}

@media (min-width: 1024px) {
  body {
    display: flex;
    place-items: center;
  }
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
