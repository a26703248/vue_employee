import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const userAccountStore = defineStore("userAccount", () => {
  const userAccount = reactive({
    id: "",
    avatar: "",
    username: "",
    created: "",
    isAdmin: false,
    role: [],
    views: [],
  });

  const setUser = (value) => {
    setId(value.id);
    setUsername(value.username);
    setAvatar(value.avatar);
    setCreated(value.created);
    setRole(value.role);
    setViews(value.views);
    setIsAdmin(value.isAdmin);
  };
  const setId = (value) => {
    userAccount.id = value;
  }
  const setUsername = (value) => {
    userAccount.username = value;
  };
  const setAvatar = (value) => {
    userAccount.avatar = value;
  };
  const setCreated = (value) => {
    userAccount.created = value;
  }
  const setRole = (value) => {
    userAccount.role = value;
  };
  const setViews = (value) => {
    userAccount.views = value;
  };
  const setIsAdmin = (value) => {
    userAccount.isAdmin = value;
  };
  const resetUserAccount = () => {
    userAccount.id = "";
    userAccount.avatar = "";
    userAccount.created = "";
    userAccount.username = "";
    userAccount.isAdmin = false;
    userAccount.role = [];
    userAccount.views = [];
  };

  return {
    userAccount,
    setAvatar,
    setUser,
    setRole,
    setViews,
    setIsAdmin,
    setUsername,
    resetUserAccount,
  };
});
