import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const menuStore = defineStore("menu", () => {
  let menu = reactive([]);
  const authorities = ref([]);
  const hasRouter = ref(false);
  const activeMenu = ref("Index");

  const setMenu = (value) => {
    menu.push(...value);
  }

  const resetMenu = () => {
    menu.splice(0, menu.length);
  }

  const setActiveMenu = (value) => {
    activeMenu.value = value;
  }

  const changeRouterStatus = (value) => {
    hasRouter.value = value;
  }

  const resetHasRouter = () => {
    hasRouter.value = false;
  }

  const setAuthorities = (value) => {
    authorities.value.push(...value);
  }

  const resetAuthorities = () => {
    authorities.value = [];
  }

  return {
    authorities,
    setAuthorities,
    resetAuthorities,
    // menu
    setActiveMenu,
    activeMenu,
    menu,
    setMenu,
    resetMenu,
    // dynamic route status
    changeRouterStatus,
    hasRouter,
    resetHasRouter,
  };
});
