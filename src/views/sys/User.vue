<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import http from "@/axios/index.js";

// table
let searchForm = reactive({});
const batchDeleteDis = ref(true);
const tableData = ref([]);
const multipleTableRef = ref();
const multipleSelection = ref([]);
const toggleSelection = (rows) => {
  if (rows) {
    rows.forEach((row) => {
      multipleTableRef.value.toggleRowSelection(row, undefined);
    });
  } else {
    multipleTableRef.value.clearSelection();
  }
};
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  batchDeleteDis.value = multipleSelection.value.length == 0;
};

const getUserList = () => {
  http
    .get("/sys/user/list", {
      params: {
        name: searchForm.username,
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

const deleteHandle = (id) => {
  let ids = [];
  if (id) {
    ids.push(id);
  } else {
    multipleSelection.value.forEach((e) => {
      ids.push(e.id);
    });
  }
  let data = new FormData();
  data.append("ids", ids);
  http.post("/sys/user/delete", data).then((res) => {
    ElMessage({
      showClose: true,
      message: "操作成功",
      type: "success",
      onClose: () => {
        getUserList();
      },
    });
  });
};

// dialog
const visibleDialog = ref(false);
const roleVisibleDialog = ref(false);
const resetPasswordVisibleDialog = ref(false);
const dialogOpenHandle = (key, data) => {
  if (key === "save") {
    resetEditForm();
    visibleDialog.value = true;
  } else if (key === "update") {
    resetEditForm();
    editHandle(data);
  } else if (key === "userHandle") {
    userHandle(data);
  } else if (key === "resetPassword") {
    resetPasswordHandle(data);
  }
};

// form
const labelPosition = ref("right");
const editFormRefs = ref(null);

let editForm = reactive({
  username: "",
  fullName: "",
  password: "",
  checkPassword: "",
  email: "",
  mobile: "",
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
  fullName: [{ required: true, message: "請輸入名稱", trigger: "blur" }],
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
  http.get("/sys/user/info/" + id).then((res) => {
    editForm = reactive(res.data.info);
    visibleDialog.value = true;
  });
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/sys/user/" + (editForm.id ? "update" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getUserList();
            },
          });
        });
      visibleDialog.value = false;
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

const resetEditForm = () => {
  editForm = reactive({
    parentId: 1,
    name: "",
    perms: "",
    icon: "",
    path: "",
    component: "",
    type: 0,
    status: 1,
    orderNum: 0,
  });
};

let roleFormRefs = ref(null);
let roleForm = reactive({});

const userHandle = (id) => {
  roleVisibleDialog.value = true;
  http.get("/sys/user/info/" + id).then((res) => {
    roleDialogTree.value.setCheckedKeys(res.data.menuIds);
    roleForm = res.data.info;
  });
};
let resetPasswordFormRefs = ref(null);

let resetPasswordForm = reactive({
  id: "",
  oldPassword: "",
  newPassword: "",
  checkNewPassword: "",
});

function validateRepeatPassword(rule, val, callback) {
  if (val === "") {
    return callback(new Error("確認新密碼是否錯誤"));
  }
  if (val == resetPasswordForm.newPassword) {
    callback();
  } else {
    return callback(new Error("密碼不一致"));
  }
}

// TODO 驗證 warning
const resetPasswordRule = reactive({
  oldPassword: [{ required: true, message: "請輸入舊密碼", trigger: "blur" }],
  newPassword: [{ required: true, message: "請輸入新密碼", trigger: "blur" }],
  checkNewPassword: [{ validator: validateRepeatPassword, trigger: "blur" }],
});

const resetPasswordHandle = ({ id, fullName }) => {
  // 亂碼 + email
  ElMessageBox.confirm(`確認是否繼續重設 "${fullName}" 使用者密碼?`, "提示", {
    confirmButtonText: "確認",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      http.post("/sys/user/rest/password/" + id);
      ElMessage({
        type: "success",
        message: "密碼重設成功",
      });
    })
    .catch(() => {});
  // 可輸入密碼
  // resetPasswordForm.id = id;
  // resetPasswordVisibleDialog.value = true;
};

const submitResetPassword = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      let formData = new FormData();
      formData.append("userId", resetPasswordForm);
      http
        .post("/sys/user/rest/password/" + resetPasswordForm.id, formData)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "重設成功",
            type: "success",
            onClose: () => {
              getUserList();
            },
          });
        });
      resetPasswordVisibleDialog.value = false;
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// TODO 分頁功能
// pagination
const currentPage = ref(4);
const pageSize = ref(10);
const pageSizes = ref([10, 20, 50, 100]);
const total = ref(0);
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  getUserList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  getUserList();
};

// tree
const roleDialogTree = ref(null);
const defaultProps = {
  children: "children",
  label: "name",
};

const roleData = ref([]);

const submitRoleFormHandle = () => {
  let menuIds = roleDialogTree.value.getCheckedKeys();
  let formData = new FormData();
  formData.append("menuIds", menuIds);
  http.post("/sys/user/role/" + roleFormRefs.id, formData).then((res) => {
    ElMessage({
      showClose: true,
      type: "success",
      message: "操作成功",
      onClose: () => {
        getUserList();
      },
    });
    roleVisibleDialog.value = false;
  });
};

// life cycle
onBeforeMount(() => {
  getUserList();
  http.get("/sys/role/list").then((res) => {
    roleData.value = res.data.records;
  });
});
</script>

<template>
  <div>
    <!-- table -->
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-input
          v-model="searchForm.username"
          placeholder="搜尋名稱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="getUserList()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogOpenHandle('save')"
          >新增</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="確定是否批量刪除" @confirm="deleteHandle()">
          <template #reference>
            <el-button type="danger" :disabled="batchDeleteDis"
              >批量刪除</el-button
            >
          </template>
        </el-popconfirm>
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
      <el-table-column type="selection" width="55" />
      <el-table-column prop="avatar" label="頭像圖示" width="55">
        <template #="scoped">
          <el-avatar size="small" :src="scoped.row.avatar"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="fullName" label="名稱" width="120" />
      <el-table-column prop="roles" label="角色">
        <template #="scoped">
          <el-tag
            type="info"
            v-for="(item, index) in scoped.row.roles"
            :key="index"
            >{{ item.name }}</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="email" label="Email" />
      <el-table-column prop="mobile" label="行動電話" />
      <el-table-column prop="status" label="狀態">
        <template #="scoped">
          <el-tag type="success" size="small" v-if="scoped.row.status === 1"
            >正常</el-tag
          >
          <el-tag type="error" size="small" v-else-if="scoped.row.status === 0"
            >禁止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="createdDate" label="建立時間" />
      <el-table-column prop="action" label="操作" width=" 300">
        <template #="scoped">
          <el-button
            type="primary"
            @click="dialogOpenHandle('userHandle', scoped.row.id)"
            link
            >分配角色</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            type="primary"
            @click="dialogOpenHandle('resetPassword', scoped.row)"
            link
            >重設密碼</el-button
          >
          <el-divider direction="vertical" />
          <el-button
            type="primary"
            @click="dialogOpenHandle('update', scoped.row.id)"
            link
            >編輯</el-button
          >
          <el-divider direction="vertical" />
          <el-popconfirm
            title="確定是否刪除"
            @confirm="deleteHandle(scoped.row.id)"
          >
            <template #reference>
              <el-button type="primary" link>刪除</el-button>
            </template>
          </el-popconfirm>
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
        <el-form-item label="名稱" prop="fullName">
          <el-input v-model="editForm.fullName" />
        </el-form-item>
        <el-form-item label="帳號" prop="username">
          <el-input v-model="editForm.username" />
          <div>初始密碼為: 88888888，新增完畢請盡速修改</div>
        </el-form-item>
        <el-form-item label="密碼" prop="password" v-if="false">
          <el-input v-model="editForm.password" type="password" show-password />
        </el-form-item>
        <el-form-item label="確認密碼" prop="checkPassword" v-if="false">
          <el-input
            v-model="editForm.checkPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="editForm.email" />
        </el-form-item>
        <el-form-item label="行動電話" prop="mobile">
          <el-input v-model="editForm.mobile" />
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
    <!-- reset password -->
    <el-dialog
      title="重設密碼"
      ref="resetPasswordFormDialog"
      v-model="resetPasswordVisibleDialog"
      width="30%"
    >
      <el-form
        ref="resetPasswordFormRefs"
        :model="resetPasswordForm"
        :rules="resetPasswordRule"
        label-width="auto"
        :label-position="labelPosition"
      >
        <el-form-item label="舊密碼" prop="oldPassword">
          <el-input
            v-model="resetPasswordForm.oldPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密碼" prop="newPassword">
          <el-input
            v-model="resetPasswordForm.newPassword"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="確認新密碼" prop="checkNewPassword">
          <el-input
            v-model="resetPasswordForm.checkNewPassword"
            type="password"
            show-password
          />
        </el-form-item>

        <!-- button -->
        <el-form-item label-width="80" edit-form-button>
          <el-button @click="visibleDialog = false">取消</el-button>
          <el-button
            type="primary"
            @click="submitResetPassword(resetPasswordFormRefs)"
            >重設</el-button
          >
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- role -->
    <el-dialog
      title="分配權限"
      ref="permDialog"
      v-model="roleVisibleDialog"
      width="30%"
    >
      <el-form ref="roleFormRefs" v-model="roleForm">
        <el-tree
          ref="roleDialogTree"
          :props="defaultProps"
          :data="roleData"
          :default-expand-all="true"
          show-checkbox
          node-key="id"
          :check-strictly="true"
        />
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="roleVisibleDialog = false">取消</el-button>
          <el-button type="primary" @click="submitRoleFormHandle()">
            送出
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.table-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
