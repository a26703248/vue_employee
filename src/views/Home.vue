<script setup>
import SideMenu from "@/views/inc/SideMenu.vue";
import Header from "@/views/inc/Header.vue";
</script>

<template>
  <el-container id="container">
    <!-- left side menu -->
    <el-aside width="200px">
      <SideMenu></SideMenu>
    </el-aside>
    <el-container>
      <!-- header -->
      <el-header>
        <Header></Header>
      </el-header>
      <!-- main -->
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
/* container start */
#container {
  height: 100vh;
}
.el-header {
  background-color: #17b3a3;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}
/* container end */
</style>
