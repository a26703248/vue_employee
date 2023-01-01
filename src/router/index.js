import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Index from "@/views/Index.vue";
import http from "@/axios/index.js";
import { menuStore } from "@/stores/menu.js";

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
        // {
        // path: '/sys/menu',
        // name: 'SysMenu',
        // component: () => import("@/views/sys/Menu.vue")
        // },
        // {
        //   path: '/sys/user',
        //   name: 'SysUser',
        //   component: () => import("@/views/.vue")
        // },
        // {
        //   path: '/sys/roles',
        //   name: 'SysRole',
        //   component: () => import("@/views/sys/Roles.vue")
        // },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
  ],
});
router.beforeEach((to, form, next) => {
  const menuItem = menuStore();
  const {
    setMenu,
    setAuthorities,
    hasRouter,
    changeRouterStatus,
  } = menuItem;
  if(!hasRouter){
    http
      .get("/sys/main/nav", {
        header: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((resp) => {
        // 取得 menuList
        setMenu(resp.data.nav);
        // 判斷是否有權限
        setAuthorities(resp.data.authorities);
        // 動態路由
        resp.data.nav.forEach((menu) => {
          if (menu.children) {
            menu.children.forEach((children) => {
              let route = menuToRoute(children);
              if (route) {
                router.addRoute(children.pathParent, route);
              }
            });
          }
        });
        changeRouterStatus(true);
      });
  }
  next();
});

const menuToRoute = (menu) => {
  if (!menu.component) {
    return null;
  }
  let route = {
    path: menu.path,
    name: menu.name,
    meta: {
      icon: menu.icon,
      title: menu.title,
    },
  };
  // issue https://github.com/sveltejs/vite-plugin-svelte/issues/175#issuecomment-937431823
  let comps = import.meta.glob("@/views/**/*.vue");
  let matchPath = comps[`/src/views/${menu.component}.vue`];
  route.component = matchPath;
  return route;
};

export default router;
