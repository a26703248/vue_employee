import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const menuStore = defineStore("menu", () => {
  const menu = reactive([]);
  const authorities = ref([]);
  const hasRouter = ref(sessionStorage.getItem("hasRoute"));

  function setMenu(value) {
    menu.push(...value);
  }

  function resetMenu() {
    menu.splice(0, menu.length);
  }

  function changeRouterStatus(value) {
    hasRouter.value = value;
    sessionStorage.setItem("hasRoute", value);
  }


  function setAuthorities(value) {
    authorities.value.push(...value);
  }

  function resetAuthorities() {
    authorities.value.splice(0, authorities.value.length);
  }

  return {
    authorities,
    setAuthorities,
    resetAuthorities,
    // menu
    menu,
    setMenu,
    resetMenu,
    // dynamic route status
    hasRouter,
    changeRouterStatus,
  }
});
