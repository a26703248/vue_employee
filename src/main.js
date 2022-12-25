import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import CusRequest from "@/axios/index.js";

import "./assets/main.css";

const app = createApp(App);
// debugger

app
.use(createPinia())
.use(router)
.use(ElementPlus);

app.config.globalProperties.$request = CusRequest;
app.mount("#app");
