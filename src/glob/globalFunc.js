import { menuStore } from "@/stores/menu.js";
import { userAccountStore } from "@/stores/user.js";
import http from "@/axios/index.js";

const hasAuth = (actionKey) => {
  const menuItem = menuStore();
  const { authorities } = menuItem;
  return authorities.indexOf(actionKey) > -1;
};

const getUserInfo = () => {
  const userItem = userAccountStore();
  http.get("/user/info").then((res) => {
    userItem.setUser(res.data);
  });
  return true;
};

export { hasAuth, getUserInfo };
