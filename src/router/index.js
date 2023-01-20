import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import Home from "@/views/Home.vue";
import Index from "@/views/Index.vue";
import http from "@/axios/index.js";
import { menuStore } from "@/stores/menu.js";
import { storeToRefs } from "pinia";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      children: [
        {
          path: "/index",
          name: "Index",
          component: Index,
        },
        {
          path: "/userProfile",
          name: "userProfile",
          component: () => import("@/views/UserProfile.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
  ],
});

router.beforeEach(async (to, form, next) => {
  let menuItem = menuStore();
  const { menu, hasRouter } = storeToRefs(menuItem);
  if (!hasRouter.value && localStorage.getItem("token")) {
    await http.get("/sys/menu/nav").then((resp) => {
      // 取得 menuList
      menuItem.setMenu(resp.data.nav);
      // 判斷是否有權限
      menuItem.setAuthorities(resp.data.authorities);
      // 動態路由
      resp.data.nav.forEach((menu) => {
        let childrenArr = new Array();
        if (menu.children) {
          menu.children.forEach((c) => {
            childrenArr.push(menuToRoute(c));
          });
        }
        menu.children = childrenArr;
        menu.path = menu.path ? menu.path : "";
        router.addRoute("home", menu);
      });
      menuItem.changeRouterStatus(true);
    });
    next({...to, replace:true});
  } else {
    router.getRoutes().forEach(e => {
      if(e.path == to.fullPath){
        menuItem.setActiveMenu(e.name)
        return;
      }
    })
    next();
  }
});

const menuToRoute = (menu) => {
  if (!menu.component) {
    return null;
  }
  let route = {
    path: menu.path,
    name: menu.name,
    icon: menu.icon,
    title: menu.title,
  };
  // issue https://github.com/sveltejs/vite-plugin-svelte/issues/175#issuecomment-937431823
  let comps = import.meta.glob("@/views/**/*.vue");
  let matchPath = comps[`/src/views/${menu.component}.vue`];
  route.component = matchPath;
  return route;
};

export default router;
