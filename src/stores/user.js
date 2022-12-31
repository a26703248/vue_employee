import { defineStore } from "pinia";
import { reactive, ref, onBeforeMount } from "vue";

export const userAccountStore = defineStore("userAccount", () => {
  const userAccount = reactive({
    username: "",
    isAdmin: false,
    role: [],
    views: [],
  });
  function setUser(value) {
    setRole(value.role);
    setViews(value.views);
    setIsAdmin(value.isAdmin);
    setUsername(value.username);
  }
  function setRole(value) {
    userAccount.role = value;
  }
  function setViews(value) {
    userAccount.views = value;
  }
  function setIsAdmin(value) {
    userAccount.isAdmin = value;
  }
  function setUsername(value) {
    userAccount.username = value;
  }
  return {
    userAccount,
    setUser,
    setRole,
    setViews,
    setIsAdmin,
    setUsername,
  };
});

export const userProfileStore = defineStore("userProfile", () => {
  const userProfile = reactive({
    avatar: "#",
    employeeId: 0,
    department: "",
    jobName: "",
    gender: "",
    seatTel: "",
    mobile: "",
    jobStartDate: "",
    email: "",
  });

  function setUserProfile(value) {
    setAvatar(value.avatar);
    setEmployeeId(value.employeeId);
    setDepartment(value.department);
    setJobName(value.jobName);
    setGender(value.gender);
    setSeatTel(value.seatTel);
    setMobile(value.mobile);
    setJobStartDate(value.jobStartDate);
    setEmail(value.email);
  }

  function setAvatar(value) {
    userProfile.avatar = value;
  }

  function setEmployeeId(value) {
    userProfile.employeeId = value;
  }

  function setDepartment(value) {
    userProfile.department = value;
  }

  function setJobName(value) {
    userProfile.jobName = value;
  }

  function setGender(value) {
    userProfile.gender = value;
  }

  function setSeatTel(value) {
    userProfile.seatTel = value;
  }

  function setMobile(value) {
    userProfile.mobile = value;
  }

  function setJobStartDate(value) {
    userProfile.jobStartDate = value;
  }

  function setEmail(value) {
    userProfile.email = value;
  }

  return {
    userProfile,
    setUserProfile,
    setAvatar,
    setEmployeeId,
    setDepartment,
    setJobName,
    setGender,
    setSeatTel,
    setMobile,
    setJobStartDate,
    setEmail,
  };
});
