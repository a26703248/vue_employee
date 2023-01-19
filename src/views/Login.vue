<template>
  <div id="login-container">
    <el-row :gutter="24" justify="center">
      <el-col :span="3" :offset="10" class="logo-col">
        <el-image class="login-logo" :src="VueLogo" />
      </el-col>
      <el-col :span="10" />
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
          <el-form-item label="密碼" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
            />
          </el-form-item>
          <el-form-item class="login-button">
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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import VueLogo from "@/assets/logo.svg";
import { tokenStore } from "@/stores/token.js";
import { userAccountStore } from "@/stores/user.js";
import http from "@/axios/index.js";
import qs from "qs"

// account
const token = tokenStore();
const userAccount = userAccountStore();

// roter
const router = useRouter();

// form
const loginFormRef = ref();
const loginForm = reactive({
  username: "admin",
  password: "root",
});

const loginRules = reactive({
  username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
});

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http.post("/login?" + qs.stringify(loginForm), {}).then((res) => {
        token.setToken(res.data.token);
        userAccount.setUser(res.data);
        router.push("/index");
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>

<style>
body {
  background-image: url("@/assets/login-background.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

#login-container {
  padding-top: 200px;
}

.login-logo {
  width: 200px;
  height: auto;
  margin-bottom: 50px;
}

.el-form-item__content {
  justify-content: center;
}
</style>
