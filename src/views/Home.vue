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
  background-color: var(--light-green);
  color: var(--black);
  text-align: center;
  line-height: 60px;
}

.el-aside {
  color: #333;
  line-height: 200px;
}

.el-main {
  background-color: var(--grey);
  color: var(--black);
  text-align: left;
  line-height: 100%;
  padding: 20px;
  padding-top: 40px;
}
/* container end */
</style>
