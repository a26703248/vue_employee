import { createRouter, createWebHistory } from 'vue-router';
import Home from "@/views/Home.vue"
import Index from "@/views/Index.vue"
import http from "@/axios/index.js"


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children:[
        {
          path: '/index',
          name: 'Index',
          component: Index
        },
        {
          path: '/userProfile',
          name: 'userProfile',
          component: () => import("../views/UserProfile.vue")
        },
        {
          path: '/sys/menu',
          name: 'SysMenu',
          component: () => import("../views/sys/Menu.vue")
        },
        {
          path: '/sys/user',
          name: 'SysUser',
          component: () => import("../views/sys/User.vue")
        },
        {
          path: '/sys/roles',
          name: 'SysRole',
          component: () => import("../views/sys/Roles.vue")
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    }
  ]
})
// TODO 測試
// router.beforeEach((to, form, next) => {
//   http.get("/sys/main/nav", {
//     header:{
//       Authorization: localStorage.getItem("token")
//     }
//   }).then(resp => {
//     // 取得 menuList

//     // 判斷是否有權限
//   })
//   next();
// })

export default router
