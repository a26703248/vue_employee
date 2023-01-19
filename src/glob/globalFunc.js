import {menuStore} from "@/stores/menu.js";
import http from "@/axios/index.js";

// TODO 操作權限
const hasAuth = (actionKey) => {
  const menuItem = menuStore();
  const {authorities} = menuItem;
  return authorities.indexOf(actionKey) > -1;
}

const getUserProfile = (id) => {
  let profileForm = new Object();
  http.post("/user/info", id).then((res) => {
    Object.entries(res.data).forEach((obj) => {
      profileForm[obj[0]] = obj[1];
    });
  });
  return profileForm;
}

export {
  hasAuth,
  getUserProfile,
}
