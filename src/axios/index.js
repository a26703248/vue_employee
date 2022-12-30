import axios from "axios";

// 共用參數配置
let config = {
  timeout: 100000,
  baseURL: "http://localhost:5173",
  headers: {
    "Content-type": "application/json; charset=utf-8"
  }
}

// 建立實體
const http = axios.create(config);

// 攔截器配置
http.interceptors.request.use( config => {
  config.headers["Authorization"] = localStorage.getItem("token");
  return config;
})

http.interceptors.response.use( resp => {
  if(resp.status === 200){
    return resp;
  }else{
    // ElementPlus.ElMessage.error(resp.msg?'發生錯誤請聯絡管理員':msg);
    console.error(resp)
    return Promise.reject(resp.data.msg);
  }
}, error => {
  if(error){
    error.message = error.response.data.msg;
  }
  switch(error.response.status){
    case 401:
      router.push("/login");
      break;
  }

  // ElementPlus.ElMessage.error(error.message, {duration:3000});
  console.error(error)
  return Promise.reject(error.message);
})

export default http;
