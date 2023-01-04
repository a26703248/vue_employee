import {menuStore} from "@/stores/menu.js"

// TODO 操作權限
const hasAuth = (actionKey) => {
  const menuItem = menuStore();
  const {authorities} = menuItem;
  return authorities.indexOf(actionKey) > -1;
}

export {
  hasAuth,
}
