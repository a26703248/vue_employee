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
import { menuStore } from "@/stores/menu.js";
import { storeToRefs } from "pinia";
const route = useRoute();

const menuItem = menuStore();
const { menu, activeMenu } = storeToRefs(menuItem);
const menuList = menu;

let iconMap = {
  document: Document,
  menu: IconMenu,
  house: House,
  setting: Setting,
  operation: Operation,
  lock: Lock,
  userFilled: UserFilled,
};
</script>

<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    :default-active="activeMenu"
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

  </el-menu>
</template>

<style scoped>
/* left menu start */
.el-menu-vertical {
  height: 100%;
}
/* left menu end */
</style>
