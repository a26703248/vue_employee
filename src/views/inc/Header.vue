<script setup>
import { ArrowDown } from "@element-plus/icons-vue";
import { reactive, ref, onBeforeMount } from "vue";
import { userAccountStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";
import { tokenStore } from "@/stores/token.js";
import { menuStore } from "@/stores/menu.js";
import { useRouter } from "vue-router";
import http from "@/axios/index.js";
import {getUserInfo} from "@/glob/globalFunc.js";

// router
const router = useRouter();

// account
const account = userAccountStore();
const {userAccount} = storeToRefs(account);
const {resetUserAccount} = account;

// menu
const menuItem = menuStore();

// token
const token = tokenStore();
const {resetToken} = token;

function logout() {
  http.post("/logout").then((res) => {
    localStorage.clear();
    sessionStorage.clear();
    resetToken();
    resetUserAccount();
    menuItem.resetHasRouter();
    router.push("/login");
  });
}

onBeforeMount(() => {
  getUserInfo();
})

</script>

<template>
  <strong>員工後臺管理系統</strong>
  <span class="header-avatar">
    <el-avatar :src="userAccount.avatar" />
    <el-dropdown>
      <!-- 帳號名稱 -->
      <span class="el-dropdown-link">
        {{ userAccount.username }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <RouterLink to="/userProfile">
            <el-dropdown-item>個人資訊</el-dropdown-item>
          </RouterLink>
          <!-- <RouterLink to="/userProfile"> -->
          <!-- <el-dropdown-item>休假資訊</el-dropdown-item> -->
          <!-- </RouterLink> -->
          <el-dropdown-item @click.prevent.stop="logout()"
            >登出</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </span>
</template>

<style scoped>
/* header start */
.example-showcase .el-dropdown-link {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.header-avatar {
  float: right;
  width: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
}
/* header end */
</style>
