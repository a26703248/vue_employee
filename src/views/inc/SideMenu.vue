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
import { useRouter } from "vue-router";
import { menuStore } from "@/stores/menu.js";
import { storeToRefs } from "pinia";

const menuItem = menuStore();
const { menu, tabsValue } = storeToRefs(menuItem);
const { addTab } = menuItem;

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
const selectMenu = (item) => {
  addTab(item);
};
</script>

<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    :default-active="tabsValue"
    class="el-menu-vertical"
    text-color="#fff"
  >
    <RouterLink to="/index">
      <el-menu-item index="Index" @click="selectMenu({name:'Index', title:'首頁'})">
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
        <el-menu-item :index="children.name" @click="selectMenu(children)">
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
