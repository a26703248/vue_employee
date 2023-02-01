<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import http from "@/axios/index.js";
import { hasAuth } from "@/glob/globalFunc.js";

// form
const size = ref("default");
const labelPosition = ref("right");
let editFormRefs = ref();

let searchForm = reactive({});

let editForm = reactive({
  empName: null,
  deptName: "",
  type: 0,
  reason: "",
  icon: "",
  path: "",
});

const editRule = reactive({
  empName: { required: true, message: "請輸入名稱", trigger: "blur" },
  deptName: { required: true, message: "請輸入權限代號", trigger: "blur" },
  icon: {},
  path: {},
  component: {},
  type: {
    required: true,
    message: "請選擇類型",
    trigger: "change",
  },
  status: {
    required: true,
    message: "請選擇狀態",
    trigger: "change",
  },
});

const editHandle = (id) => {
  http.get("/emp/leave/info/" + id).then((res) => {
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const resetEditForm = () => {
  editForm = reactive({
    parentId: null,
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

const cancelForm = (formEl) => {
  debugger;
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
          visibleDialog.value = false;
        });
    } else {
      console.log("error submit!", fields);
      return false;
    }
  });
};

// dialog
const formDialog = ref();
const visibleDialog = ref(false);

const dialogOpenHandle = (action) => {};
const getLeaveList = () => {
  http.get("/leave/list", {
    params: {
      empName: searchForm.name,
      empName: searchForm.dateRange,
      currentPage: currentPage.value,
      pageSize: pageSize.value,
    },
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
  // getLeaveList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  // getLeaveList();
};

// onBeforeMount(() => {
//   getLeaveList();
// });
</script>

<template>
  <el-form :inline="true" class="form-inline">
    <el-form-item>
      <el-input
        v-model="searchForm.username"
        placeholder="搜尋名稱"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="searchForm.dateRange"
        type="daterange"
        range-separator="到"
        start-placeholder="開始日期"
        end-placeholder="結束日期"
        size="small"
      />
    </el-form-item>
    <el-form-item>
      <el-button type="info" @click="getLeaveList()">搜索</el-button>
    </el-form-item>
    <el-form-item v-if="hasAuth('sys:menu:save')">
      <el-button type="primary" @click="dialogOpenHandle('save')"
        >新增</el-button
      >
    </el-form-item>
  </el-form>

  <el-table
    :data="tableData"
    style="width: 100%; margin-bottom: 20px"
    row-key="id"
    stripe
    border
  >
    <el-table-column prop="empName" label="員工姓名" />
    <el-table-column prop="deptName" label="部門" />
    <el-table-column prop="job" label="職務" />
    <el-table-column prop="type" label="請假類型" />
    <el-table-column prop="amount" label="申請補助費用" />
    <el-table-column prop="created" label="申請時間" />
    <el-table-column prop="updated" label="審核時間" />
    <el-table-column prop="status" label="狀態">
      <template #="scoped">
        <el-tag type="error" size="small" v-if="scoped.status == 2">
          退回
        </el-tag>
        <el-tag type="success" size="small" v-if="scoped.status == 1">
          通過
        </el-tag>
        <el-tag type="warning" size="small" v-if="scoped.status == 0">
          未審核
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="action" label="操作">
      <template #="scoped">
        <el-button
          v-if="hasAuth('emp:leave:review')"
          type="primary"
          @click="dialogOpenHandle('leaveReviewHandle', scoped.row.id)"
          link
          >審核</el-button
        >
        <el-divider direction="vertical" />
        <el-button
          v-if="hasAuth('emp:leave:update')"
          type="primary"
          @click="dialogOpenHandle('leaveUpdateHandle', scoped.row.id)"
          link
          >修改</el-button
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

  <el-dialog ref="formDialog" v-model="visibleDialog" width="30%">
    <el-form
      ref="editFormRefs"
      :model="editForm"
      :rules="editRule"
      label-width="auto"
      :label-position="labelPosition"
      :size="size"
    >
      <el-table-column prop="empName" label="員工姓名" />
      <el-table-column prop="deptName" label="部門" />
      <el-table-column prop="job" label="職務" />
      <el-table-column prop="type" label="請假類型" />
      <el-table-column prop="reason" label="請假原因" />
      <el-table-column prop="amount" label="申請補助費" />

      <!-- button -->
      <el-form-item label-width="80" edit-form-button>
        <el-button @click="cancelForm(editFormRefs)">取消</el-button>
        <el-button type="primary" @click="submitForm(editFormRefs)"
          >新增</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.table-pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
