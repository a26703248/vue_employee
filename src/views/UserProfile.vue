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
        <el-form-item label="使用者帳號" prop="username">
          {{ loginProfileForm.username ? loginProfileForm.username : "test" }}
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
            @click="submitForm(loginProfileFormRef)"
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
        <el-form-item label="座位電話" prop="seatTel">
          {{ profileForm.seatTel }}
        </el-form-item>

        <el-form-item label="email" prop="email">
          <el-col :span="11">
            <el-input v-model="profileForm.password" />
          </el-col>
          <el-col :span="1"> @ </el-col>
          <el-col :span="12">
            <el-input v-model="profileForm.password" />
          </el-col>
        </el-form-item>

        <el-form-item class="submit-button">
          <el-button type="primary" @click="submitForm(profileFormRef)">
            送出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from "vue";

function validateRepeatPassword(rule, val, callback){
  console.log(val);
  if(val === ""){
    return callback(new Error("確認新密碼是否錯誤"));
  }
  if(val == loginProfileForm.newPassword){
    callback();
  }else{
    return callback(new Error("密碼不一致"));
  }
}

const loginProfileFormRef = ref();
const loginProfileForm = reactive({
  username: "",
  oldPassword: "",
  newPassword: "",
  repeatNewPassword: "",
});

const loginProfileRules = reactive({
  username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  oldPassword: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  newPassword: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  repeatNewPassword: [{validator: validateRepeatPassword, trigger: "blur" }],
});

const profileFormRef = ref();

const profileForm = reactive({
  employeeId: -1,
  department: "資訊部門",
  jobName: "工程師",
  gender: "male",
  seatTel: "04",
  mobile: "0912345678",
  jobStartDate: "2022-02-01",
  email: "XXX@gmail.com",
});

const profileRules = reactive({
  username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
});

const instance = getCurrentInstance();

// TODO 表單請求送出測試
const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      instance.proxy.$request.post("/user/update", (res) => {
        router.push("/login");
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
};
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
</style>
