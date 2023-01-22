<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import http from "@/axios/index.js";
import { userAccountStore } from "@/stores/user.js";
import { storeToRefs } from "pinia";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
const router = useRouter();

// login
const account = userAccountStore();
const { userAccount } = storeToRefs(account);
const passwordFormRef = ref();
const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  repeatNewPassword: "",
});
const passwordProfileRules = reactive({
  oldPassword: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  newPassword: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  repeatNewPassword: [{ validator: validateRepeatPassword, trigger: "blur" }],
});
function validateRepeatPassword(rule, val, callback) {
  if (val === "") {
    callback(new Error("確認新密碼是否錯誤"));
  }
  if (val === passwordForm.newPassword) {
    callback();
  } else {
    callback(new Error("密碼不一致"));
  }
}

// function
const submitForm = async (formEl, formName) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      switch (formName) {
        case "account":
          http.post("/sys/user/updatePass", passwordForm).then((res) => {
            ElMessage({
              showClose: true,
              type: "success",
              message: "密碼修改成功",
              duration: 3000,
              onClose: () => {
                router.push("/login");
              },
            });
          });
          break;
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

</script>

<template>
  <div class="page-title">個人資訊</div>
  <div class="profile-form">
    <div class="form">
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordProfileRules"
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
            v-model="passwordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密碼" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="確認新密碼" prop="repeatNewPassword">
          <el-input
            v-model="passwordForm.repeatNewPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item class="submit-button">
          <el-button
            type="primary"
            @click="submitForm(passwordFormRef, 'account')"
            class="form-button"
          >
            送出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
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
  height:36px;
  font-size: 36px;
  display:flex;
  margin: 10px;
  flex-wrap: wrap;
  align-content:center;
  justify-content:center;
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
