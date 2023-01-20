import axios from "axios";
import { ElMessage } from "element-plus";
import {useRouter} from "vue-router";

// 共用參數配置
let config = {
  timeout: 100000,
  baseURL: "http://localhost:8080",
  headers: {
    "Content-type": "application/json; charset=utf-8",
  },
};

// 建立實體
const http = axios.create(config);

// 攔截器配置
http.interceptors.request.use((config) => {
  config.headers["Authorization"] = localStorage.getItem("token");
  return config;
});

http.interceptors.response.use(
  (resp) => {
    let res = resp.data;
    if (res.code === 200) {
      return res;
    } else {
      ElMessage({
        showClose: true,
        message: res.msg ? res.msg : "發生錯誤請聯絡管理員",
        type: "error",
      });
      console.error(res);
      return Promise.reject(res.msg);
    }
  },
  (error) => {
    if (error) {
      error.message = error.response.data.msg;
    }
    let msg = null;
    switch (error.response.status) {
      case 401:
        msg = "權限不足";
        break;
      case 404:
        msg = "找不到該頁面,請聯絡管理員";
        break;
      default:
        msg = "發生錯誤請聯絡管理員";
    }

    ElMessage({
      showClose: true,
      message: msg,
      type: "error",
      duration: 3000,
    });
    console.error(error.message);
    return Promise.reject(error.message);
  }
);

export default http;
