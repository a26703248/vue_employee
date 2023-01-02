<template>
  <div class="page-title">個人資訊</div>
  <div class="profile-form">
    <div class="form">
      <el-form
        ref="loginProfileFormRef"
        :model="loginProfileForm"
        :rules="loginProfileRules"
        label-width="120px"
        class="account-form"
        status-icon
        size="large"
      >
        <el-form-item label="使用者帳號">
          {{ userAccount.username }}
        </el-form-item>
        <el-form-item label="舊密碼" prop="oldPassword">
          <el-input
            v-model="loginProfileForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密碼" prop="newPassword">
          <el-input
            v-model="loginProfileForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="確認新密碼" prop="repeatNewPassword">
          <el-input
            v-model="loginProfileForm.repeatNewPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item class="submit-button">
          <el-button
            type="primary"
            @click="submitForm(loginProfileFormRef, 'account')"
            class="form-button"
          >
            送出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider direction="vertical" />
    <div class="form">
      <el-form
        ref="profileFormRef"
        :model="profileForm"
        :rules="profileRules"
        label-width="120px"
        class="detail-form"
        status-icon
        size="large"
      >
        <el-form-item label="員工編號" prop="employeeId">
          {{ profileForm.employeeId }}
        </el-form-item>
        <el-form-item label="部門" prop="department">
          {{ profileForm.department }}
        </el-form-item>
        <el-form-item label="職務" prop="jobName">
          {{ profileForm.jobName }}
        </el-form-item>
        <el-form-item label="性別" prop="gender">
          {{ profileForm.gender === "male" ? "男性" : "女性" }}
        </el-form-item>
        <el-form-item label="座位電話" prop="seatTel">
          {{ profileForm.seatTel }}
        </el-form-item>
        <el-form-item label="行動電話" prop="mobile">
          {{ profileForm.mobile }}
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="profileForm.email" />
        </el-form-item>

        <el-form-item class="submit-button">
          <el-button
            type="primary"
            @click="submitForm(profileFormRef, 'profile')"
          >
            送出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import http from "@/axios/index.js";
import { userAccountStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";

// login
const account = userAccountStore();
const { userAccount } = storeToRefs(account);
const loginProfileFormRef = ref();
const loginProfileForm = reactive({
  oldPassword: "",
  newPassword: "",
  repeatNewPassword: "",
});
const loginProfileRules = reactive({
  oldPassword: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  newPassword: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  repeatNewPassword: [{ validator: validateRepeatPassword, trigger: "blur" }],
});
function validateRepeatPassword(rule, val, callback) {
  if (val === "") {
    return callback(new Error("確認新密碼是否錯誤"));
  }
  if (val == loginProfileForm.newPassword) {
    callback();
  } else {
    return callback(new Error("密碼不一致"));
  }
}

// profile
const profileFormRef = ref();
const profileForm = reactive({
  employeeId: 0,
  department: "",
  jobName: "",
  gender: "",
  seatTel: "",
  mobile: "",
  jobStartDate: "",
  email: "",
});
const profileRules = reactive({
  email: [
    {
      required: true,
      message: "Email 信箱必填",
      trigger: "blur",
    },
    {
      type: "email",
      message: "Email信箱格式錯誤",
      trigger: ["blur", "change"],
    },
  ],
});

// function
const submitForm = async (formEl, formName) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      switch (formName) {
        case "account":
          http.post("/user/update/account", (res) => {
            router.push("/login");
          });
          break;
        case "profile":
          http.post("/user/update/profile", (res) => {
            router.push("/login");
          });
          break;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

function getUserProfile(id) {
  http.post("/user/info", id).then((res) => {
    Object.entries(res.data).forEach((obj) => {
      profileForm[obj[0]] = obj[1];
    });
  });
}

onBeforeMount(() => {
  let id = -1;
  getUserProfile(id);
});
</script>

<style>
.submit-button .el-form-item__content {
  justify-content: flex-end;
}

.profile-form {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.profile-form .form {
  padding: 0 30px 0 30px;
  width: 50%;
  display: flex;
  justify-content: center;
}
.page-title {
  font-size: 36px;
}

.divider-vertical {
  height: 100%;
}

.el-divider {
  height: 500px;
  border-width: 1px;
}

.el-form-item__content {
  justify-content: center;
}
</style>
