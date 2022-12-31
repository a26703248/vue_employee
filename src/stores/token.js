import { defineStore } from 'pinia'

export const tokenStore = defineStore('token', {
  state: () => ({
    token: "",
  }),
  getters: {
    getToken: (state) => state.token,
  },
  actions: {
    setToken(value){
      this.token = value;
    },
    resetToken(){
      this.token = "";
    }
  }
})
