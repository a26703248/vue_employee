import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const menuStore = defineStore("men", () => {
  const menu = reactive([]);
  const authorities = reactive([]);
  const hasRouter = ref(sessionStorage.getItem("hasRoute"));
  const tabsValue = ref("Index");
  const tabs = ref([
    {
      title: "首頁",
      name: "Index",
    },
  ]);

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
    authorities.push(...value);
  }

  function resetAuthorities() {
    authorities.splice(0, authorities.length);
  }

  function addTab(tab) {
    tabs.value.push({
      title: tab.title,
      name: tab.name,
    });
    tabsValue.value = tab.name;
  }

  return {
    // dynamic menu
    menu,
    authorities,
    setMenu,
    resetMenu,
    setAuthorities,
    resetAuthorities,
    // dynamic route status
    hasRouter,
    changeRouterStatus,
    // tab
    tabsValue,
    tabs,
    addTab,
  };
});
