<template>
  <el-row :gutter="24">
    <el-col :span="20">
      <el-image class="login-logo" :src="VueLogo" :fit="fit" />
    </el-col>
  </el-row>

  <el-row :gutter="24">
    <el-col>
      <el-form :model="form" label-width="50px">
        <el-form-item label="Username">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Login</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref } from 'vue';
import VueLogo from "../assets/logo.svg";

const form = reactive({
  username: '',
  password: '',
})

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style>
.login-logo {
  width:200px;
  height:auto;
  margin-bottom:50px;
}

.el-form-item__content {
  justify-content: flex-end;
}
</style>
