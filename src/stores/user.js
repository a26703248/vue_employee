import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const userAccountStore = defineStore("userAccount", () => {
  const userAccount = reactive({
    avatar:"",
    username: "",
    isAdmin: false,
    role: [],
    views: [],
  });
  function setUser(value) {
    setRole(value.role);
    setViews(value.views);
    setIsAdmin(value.isAdmin);
    setUsername(value.username);
  }
  function setAvatar(value){
    userAccount.avatar = value;
  }
  function setRole(value) {
    userAccount.role = value;
  }
  function setViews(value) {
    userAccount.views = value;
  }
  function setIsAdmin(value) {
    userAccount.isAdmin = value;
  }
  function setUsername(value) {
    userAccount.username = value;
  }
  return {
    userAccount,
    setAvatar,
    setUser,
    setRole,
    setViews,
    setIsAdmin,
    setUsername,
  };
});
