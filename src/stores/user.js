import { defineStore } from 'pinia'

export const userAccountStore = defineStore('userAccount', {
  state: () => ({
    userAccount:{
      username:"",
      isAdmin:false,
      role:[],
      views:[],
    },
  }),
  getters: {
    getRole: (state) => state.userAccount.role,
    getViews: (state) => state.userAccount.views,
    getIsAdmin: (state) => state.userAccount.isAdmin,
    getUsername: (state) => state.userAccount.username,
  },
  actions: {
    setUser(value){
      this.setRole(value.role);
      this.setViews(value.views);
      this.setIsAdmin(value.isAdmin);
      this.setUsername(value.username);
    },
    setRole(value){
      this.userAccount.role = value;
    },
    setViews(value){
      this.userAccount.views = value;
    },
    setIsAdmin(value){
      this.userAccount.isAdmin = value;
    },
    setUsername(value){
      this.userAccount.username = value;
    },
  }
});

export const userProfileStore = defineStore('userProfile', {
  state: () => ({
    userProfile: {
      avatar:"#",
      employeeId: 0,
      department: "",
      jobName: "",
      gender: "",
      seatTel: "",
      mobile: "",
      jobStartDate: "",
      email: "",
    },
  }),
  getters: {
    getAvatar: (state) => state.userProfile.avatar,
    getEmployeeId: (state) => state.userProfile.employeeId,
    getDepartment: (state) => state.userProfile.department,
    getJobName: (state) => state.userProfile.jobName,
    getGender: (state) => state.userProfile.gender,
    getSeatTel: (state) => state.userProfile.seatTel,
    getMobile: (state) => state.userProfile.mobile,
    getJobStartDate: (state) => state.userProfile.jobStartDate,
    getEmail: (state) => state.userProfile.email,
  },
  actions: {
    setUserProfile(value){
      this.setAvatar(value.avatar);
      this.setEmployeeId(value.employeeId);
      this.setDepartment(value.department);
      this.setJobName(value.jobName);
      this.setGender(value.gender);
      this.setSeatTel(value.seatTel);
      this.setMobile(value.mobile);
      this.setJobStartDate(value.jobStartDate);
      this.setEmail(value.email);
    },
    setAvatar(value){
      this.userProfile.avatar = value;
    },
    setEmployeeId(value){
      this.userProfile.employeeId = value;
    },
    setDepartment(value){
      this.userProfile.department = value;
    },
    setJobName(value){
      this.userProfile.jobName = value;
    },
    setGender(value){
      this.userProfile.gender = value;
    },
    setSeatTel(value){
      this.userProfile.seatTel = value;
    },
    setMobile(value){
      this.userProfile.mobile = value;
    },
    setJobStartDate(value){
      this.userProfile.jobStartDate = value;
    },
    setEmail(value){
      this.userProfile.email = value;
    }
  }
})

