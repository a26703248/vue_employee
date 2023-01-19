import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const tokenStore = defineStore("token", () => {
  const token = ref("");
  function setToken(value) {
    token.value = value;
    localStorage.setItem("token", value);
  }
  function resetToken() {
    token.value = "";
  }
  return {
    token,
    setToken,
    resetToken,
  };
});
