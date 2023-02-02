<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import http from "@/axios/index.js";
import { hasAuth } from "@/glob/globalFunc.js";

// table
let searchForm = reactive({});
const tableData = ref([]);
const multipleTableRef = ref();


const getEmpList = () => {
  http
    .get("/emp/manage/list", {
      params: {
        empName: searchForm.empName,
        currentPage: currentPage.value,
        pageSize: pageSize.value,
      },
    })
    .then((res) => {
      tableData.value = res.data.records;
      pageSize.value = res.data.pageSize;
      currentPage.value = res.data.currentPage;
      total.value = res.data.total;
    });
};

// dialog
const visibleDialog = ref(false);
const resetPasswordVisibleDialog = ref(false);
const dialogOpenHandle = (key, data) => {
  if (key === "save") {
    resetEditForm();
    visibleDialog.value = true;
  } else if (key === "update") {
    resetEditForm();
    editHandle(data);
  } else if (key === "userAuthHandle") {
    userAuthHandle(data);
  } else if (key === "resetPassword") {
    resetPasswordHandle(data);
  }
};

// form
const labelPosition = ref("right");
const editFormRefs = ref(null);

let editForm = reactive({
  empName: "",
  user_id: "",
  mobile: "",
  email: "",
  status: 1,
});

function validateCreatedRepeatPassword(rule, val, callback) {
  if (val === "") {
    callback(new Error("確認新密碼是否錯誤"));
  }
  if (val === editForm.password) {
    callback();
  } else {
    callback(new Error("密碼不一致"));
  }
}

const validateMobile = (rule, val, callback) => {
  if (val === "") {
    callback(new Error("確認行動電話格式是否錯誤"));
  }
  if (/^09\d{8,10}$/.test(val)) {
    callback();
  } else {
    callback(new Error("確認行動電話格式是否錯誤"));
  }
};

const editRule = reactive({
  username: [{ required: true, message: "請輸入帳號", trigger: "blur" }],
  password: [{ required: true, message: "請輸入密碼", trigger: "blur" }],
  checkPassword: [
    { required: true, message: "請確認密碼", trigger: "blur" },
    { validator: validateCreatedRepeatPassword, trigger: "blur" },
  ],
  email: [
    { type: "email", message: "Email 格式錯誤", trigger: ["blur", "change"] },
  ],
  mobile: [
    { required: true, message: "請輸入行動電話", trigger: "blur" },
    { validator: validateMobile, trigger: ["blur", "change"] },
  ],
});

const editHandle = (id) => {
  http.get("/emp/user/info/" + id).then((res) => {
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/emp/manage/" + (editForm.id ? "update" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getEmpList();
            },
          });
          visibleDialog.value = false;
        });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

const resetEditForm = () => {
  editForm = reactive({
    username: "",
    password: "",
    checkPassword: "",
    email: "",
    mobile: "",
    status: 1,
  });
};

// pagination
const currentPage = ref(1);
const pageSize = ref(20);
const pageSizes = ref([10, 20, 50, 100]);
const total = ref(0);
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  getEmpList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  getEmpList();
};

// life cycle
onBeforeMount(() => {
  getEmpList();
});

</script>

<template>
  <div>
    <!-- table -->
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-input
          v-model="searchForm.empName"
          placeholder="搜尋員工名稱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="getEmpList()">搜索</el-button>
      </el-form-item>
      <el-form-item v-if="hasAuth('emp:manage:save')">
        <el-button type="primary" @click="dialogOpenHandle('save')"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTableRef"
      :data="tableData"
      style="width: 100%"
      stripe
      border
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column prop="empSequence" label="員工編號" width="120" />
      <el-table-column prop="empName" label="員工名稱" width="120" />
      <el-table-column prop="jobName" label="職務" />
      <el-table-column prop="dept" label="部門" />
      <el-table-column prop="account.mobile" label="行動電話" />
      <el-table-column prop="account.created" label="到職日期" />
      <el-table-column prop="account.updated" label="更新日期" />
      <el-table-column prop="account.username" label="使用帳號" />
      <el-table-column prop="account.status" label="狀態">
        <template #="scoped">
          <el-tag type="success" size="small" v-if="scoped.row.account.status === 1"
            >正常</el-tag
          >
          <el-tag type="error" size="small" v-else-if="scoped.row.account.status === 0"
            >禁止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width=" 300">
        <template #="scoped">
          <span
            v-if="hasAuth('emp:manage:role')"
          >
          <el-button
            type="primary"
            @click="dialogOpenHandle('userAuthHandle', scoped.row.id)"
            link
            >選擇帳號</el-button
          >
          <el-divider direction="vertical" />
          </span>
          <el-button
            v-if="hasAuth('emp:manage:update')"
            type="primary"
            @click="dialogOpenHandle('update', scoped.row.id)"
            link
            >編輯</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- pagination -->
    <el-pagination
      class="table-pagination"
      layout="total, sizes, prev, pager, next, jumper"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="pageSizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- create form -->
    <el-dialog
      title="新增帳號"
      ref="formDialog"
      v-model="visibleDialog"
      width="30%"
    >
      <el-form
        ref="editFormRefs"
        :model="editForm"
        :rules="editRule"
        label-width="auto"
        :label-position="labelPosition"
      >
        <el-form-item label="員工姓名" prop="empName">
          <el-input v-model="editForm.empName" />
        </el-form-item>
        <el-form-item label="職務" prop="jobName">
          <el-input v-model="editForm.jobName" />
        </el-form-item>
        <el-form-item label="行動電話" prop="mobile">
          <el-input v-model="editForm.mobile" />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- button -->
        <el-form-item label-width="80" edit-form-button>
          <el-button @click="visibleDialog = false">取消</el-button>
          <el-button type="primary" @click="submitForm(editFormRefs)"
            >新增</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<style scoped>
.table-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
