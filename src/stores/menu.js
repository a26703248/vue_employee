import { defineStore } from "pinia";
import { reactive, ref } from "vue";

export const menuStore = defineStore("men", () => {
  const authorities = reactive([]);
  const tabsValue = ref("Index");
  const tabs = ref([
    {
      title: "首頁",
      name: "Index",
    },
  ]);

  function setAuthorities(value) {
    authorities.push(...value);
  }

  function resetAuthorities() {
    authorities.splice(0, authorities.length);
  }

  function addTab(tab) {
    let index = tabs.value.findIndex(e => e.name === tab.name)
    if(index === -1){
      tabs.value.push({
        title: tab.title,
        name: tab.name,
      });
    }
    tabsValue.value = tab.name;
  }

  return {
    // dynamic menu
    authorities,
    setAuthorities,
    resetAuthorities,
    // tab
    tabsValue,
    tabs,
    addTab,
  };
});
