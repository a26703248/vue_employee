import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useJwtStore = defineStore('token', {
  state: () => ({
    jwtToken: "",
  }),
  getters: {
    getJwtToken: (state) => state.jwtToken,
  },
  action: {
    setJwtToken(value){
      this.jwtToken = value;
    },
    resetJwtToken(){
      this.jwtToken = "";
    }
  }
})
