<script setup>
import { ArrowDown} from "@element-plus/icons-vue";
import { reactive, ref, getCurrentInstance, onBeforeMount} from 'vue'
let userInfo = reactive({
  id:-1,
  username:"",
  avatar:"#"
})

// TODO 帳號訊息帶出測試
function getUserInfo(){
  let instance = getCurrentInstance();
  instance.proxy.$request("/sys/userInfo").then(res => {
    userInfo = res.data.data;
  })
}

onBeforeMount(() => {
  getUserInfo();
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
          <RouterLink to="/logout">
            <el-dropdown-item>登出</el-dropdown-item>
          </RouterLink>
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
