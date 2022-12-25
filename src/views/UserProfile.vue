<template>
  <div class="page-title">個人資訊</div>
  <div class="profile-form">
    <div class="form">
      <el-form
        ref="loginProfileFormRef"
        :model="loginProfileForm"
        :rules="loginProfileRules"
        label-width="120px"
        class="demo-ruleForm"
        status-icon
        size="large"
      >
        <el-form-item label="使用者帳號" prop="username">
          {{ loginProfileForm.username?loginProfileForm.username:"test" }}
        </el-form-item>
        <el-form-item label="密碼" type="password" prop="password">
          <el-input v-model="loginProfileForm.password" />
        </el-form-item>
        <el-form-item label="確認密碼" type="password" prop="password">
          <el-input v-model="loginProfileForm.repeat_password" />
        </el-form-item>
        <el-form-item>
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
        class="demo-ruleForm"
        status-icon
        size="large"
      >
        <el-form-item label="員工編號" prop="employeeId">
          {{ profileForm.employeeId }}
        </el-form-item>
        <el-form-item label="部門" prop="department">
          {{ profileForm.department}}
        </el-form-item>
        <el-form-item label="職務" prop="jobName">
          {{ profileForm.jobName }}
        </el-form-item>
        <el-form-item label="性別" prop="gender">
          {{ profileForm.gender === "male"? '男性':"女性"}}
        </el-form-item>
        <el-form-item label="座位電話" prop="seatTel">
          {{ profileForm.seatTel}}
        </el-form-item>
        <el-form-item label="座位電話" prop="seatTel">
          {{ profileForm.seatTel}}
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

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm(profileFormRef)"
            class="form-button"
          >
            送出
          </el-button>
        </el-form-item>

      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from "vue";
const loginProfileFormRef = ref();
const loginProfileForm = reactive({
  username: "",
  password: "",
});

const loginProfileRules = reactive({
  username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
});

const profileFormRef = ref();

const profileForm = reactive({
  employeeId:-1,
  department: "資訊部門",
  jobName: "工程師",
  gender: "male",
  seatTel: "04",
  mobile: "0912345678",
  jobStartDate:"2022-02-01",
  email:"XXX@gmail.com",
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

<style scoped>

.profile-form {
  width: 100%;
  display: flex;
  justify-content: space-around;
}
.profile-form .form {
  padding:0 30px 0 30px;
  width: 50%;
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
