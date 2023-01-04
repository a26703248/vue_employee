import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const menuStore = defineStore("menu", () => {
  const authorities = ref([]);

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
  }
});
