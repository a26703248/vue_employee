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
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
const route = useRoute();

const menuList = [
  {
    title: "帳戶管理",
    name: "AccountMana",
    icon: "setting",
    component: "",
    path: "",
    children: [
      {
        title: "帳戶設定",
        name: "SysUser",
        component: "sys/User",
        icon: "userFilled",
        path: "/sys/user",
      },
      {
        title: "權限設定",
        name: "SysRole",
        component: "sys/Roles",
        icon: "lock",
        path: "/sys/roles",
      },
      {
        title: "選單設定",
        name: "SysMenu",
        component: "sys/Menu",
        icon: "document",
        path: "/sys/menu",
      },
    ],
  },
  {
    title: "系統工具",
    name: "SystemTool",
    icon: "operation",
    component: "",
    path: "",
    children: [],
  },
];

let iconMap = {
  document: Document,
  menu: IconMenu,
  house: House,
  setting: Setting,
  operation: Operation,
  lock: Lock,
  userFilled: UserFilled,
};

let activeName = computed(() => {
  let menuNameList = ["AccountMana", "SysUser", "SysRole", "SysMenu"]
  return menuNameList.includes(route.name)?route.name:"Index";
})
</script>

<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    :default-active="activeName"
    class="el-menu-vertical"
    text-color="#fff"
  >
    <RouterLink to="/index">
      <el-menu-item index="Index">
        <el-icon><House /></el-icon>
        <template #title>首頁</template>
      </el-menu-item>
    </RouterLink>

    <el-sub-menu :index="menu.name" v-for="menu in menuList" :key="menu.name">
      <template #title>
        <el-icon>
          <component :is="iconMap[menu.icon]" />
        </el-icon>
        <span>{{ menu.title }}</span>
      </template>
      <RouterLink
        :to="children.path"
        v-for="children in menu.children"
        :key="children.name"
      >
        <el-menu-item :index="children.name">
          <el-icon>
            <component :is="iconMap[children.icon]" />
          </el-icon>
          <template #title>{{ children.title }}</template>
        </el-menu-item>
      </RouterLink>
    </el-sub-menu>

    <!-- <el-sub-menu index="1">
      <template #title>
        <el-icon><setting /></el-icon>
        <span>帳戶管理</span>
      </template>
      <RouterLink to="/sys/user">
        <el-menu-item index="2-1">
          <el-icon><Lock /></el-icon>
          <template #title>帳戶設定</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/sys/roles">
        <el-menu-item index="2-2">
            <el-icon><UserFilled /></el-icon>
            <template #title>權限設定</template>
        </el-menu-item>
      </RouterLink>
      <RouterLink to="/sys/menu">
        <el-menu-item index="2-3">
          <el-icon><document /></el-icon>
          <template #title>選單管理</template>
        </el-menu-item>
      </RouterLink>
    </el-sub-menu>

    <el-sub-menu index="2">
      <template #title>
        <el-icon><operation /></el-icon>
        <span>系統工具</span>
      </template>
    </el-sub-menu> -->
  </el-menu>
</template>

<style scoped>
/* left menu start */
.el-menu-vertical {
  height: 100%;
}
/* left menu end */
</style>
