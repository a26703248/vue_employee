<script setup>
import {
  Document,
  Menu as IconMenu,
  House,
  Setting,
  Operation,
  Lock,
  UserFilled,
} from "@element-plus/icons-vue";
</script>

<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical"
    default-active="2"
    text-color="#fff"
  >
    <RouterLink to="/index">
      <el-menu-item index="0">
        <el-icon><House /></el-icon>
        <template #title>首頁</template>
      </el-menu-item>
    </RouterLink>
    <el-menu-item index="1">
      <template #title>
        <el-icon><document /></el-icon>
        <span>XX管理</span>
      </template>
    </el-menu-item>
    <el-sub-menu index="2">
      <template #title>
        <el-icon><setting /></el-icon>
        <span>帳戶管理</span>
      </template>
      <RouterLink to="/user">
        <el-menu-item index="2-1">
          <el-icon><Lock /></el-icon>
          <template #title>帳戶設定</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/roles">
        <el-menu-item index="2-2">
          <el-icon><UserFilled /></el-icon>
          <template #title>權限設定</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/menu">
        <el-menu-item index="2-3">
          <el-icon><document /></el-icon>
          <template #title>菜單管理</template>
        </el-menu-item>
      </RouterLink>
    </el-sub-menu>

    <el-sub-menu index="3">
      <template #title>
        <el-icon><operation /></el-icon>
        <span>系統工具</span>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
/* left menu start */
.el-menu-vertical {
  height: 100%;
}
/* left menu end */
</style>
