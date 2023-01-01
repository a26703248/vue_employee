<script setup>
import { ref, computed } from 'vue'
import {menuStore} from "@/stores/menu.js";
import {storeToRefs} from "pinia";
import { useRouter } from "vue-router";
const router = useRouter();

let tabIndex = 2
const menuItem = menuStore();
const {tabsValue, tabs} = storeToRefs(menuItem);

const editableTabsValue = computed({
  get(){
    return tabsValue.value;
  },
  set(value){
    tabsValue.value = value;
  }
})

const editableTabs = computed({
  get(){
    return tabs.value;
  },
  set(value){
    tabs.value = value;
  }
})

const removeTab = (targetName) => {
  const tabsList = editableTabs.value
  let activeName = editableTabsValue.value
  if (activeName === targetName) {
    tabsList.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabsList[index + 1] || tabsList[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  editableTabsValue.value = activeName
  editableTabs.value = tabsList.filter((tab) => tab.name !== targetName)
}

const clickTab = (target) => {
  router.push({name:target.props.name});
}
</script>

<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
    >
      {{ item.content }}
    </el-tab-pane>
  </el-tabs>
</template>

<style scoped>
</style>
