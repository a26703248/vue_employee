<script setup>
import { ArrowDown} from "@element-plus/icons-vue";
import { reactive, ref, onBeforeMount} from 'vue'
import {useTokenStore} from "@/stores/token.js";
import { useRouter } from 'vue-router'
import http from "@/axios/index.js"

const router = useRouter();

let userInfo = reactive({
  id:-1,
  username:"",
  avatar:"#"
})

// TODO 帳號訊息帶出測試
function getUserInfo(){
  http.get("/sys/userInfo").then(res => {
    userInfo = res.data.data;
  })
}

function logout(){
  router.push("/login");
  // TODO 待測試
  // http.post("/logout").then(res => {
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   useTokenStore.resetJwtToken();
  // })
}

onBeforeMount(() => {
  // getUserInfo();
})

</script>

<template>
  <strong>VueAdmin 後臺管理系統</strong>
  <span class="header-avatar">
    <el-avatar :src="userInfo.avatar" />
    <el-dropdown>
      <!-- 帳號名稱 -->
      <span class="el-dropdown-link">
        {{ userInfo.username }}
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
            <el-dropdown-item>休假資訊</el-dropdown-item>
          <!-- </RouterLink> -->
          <el-dropdown-item @click.prevent.stop="logout()">登出</el-dropdown-item>
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
