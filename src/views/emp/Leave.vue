<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import http from "@/axios/index.js";
import { hasAuth } from "@/glob/globalFunc.js";

// form
const size = ref("default");
const labelPosition = ref("right");
let editFormRefs = ref();
const tableData = ref([]);
const formAction = ref("");
const empOption = ref([]);
const typeOption = ref(["事假", "病假", "公假", "特休假"]);

let searchForm = reactive({});

let editForm = reactive({
  type: null,
  empId: null,
  reason: "",
  amount: 0,
  startDate: null,
  endDate: null,
});

const editRule = reactive({
  empId: { required: true, message: "請選擇員工", trigger: "blur" },
  type: { required: true, message: "請選擇請假類型", trigger: "blur" },
  startDate: { required: true, message: "請選擇開始日期", trigger: "blur" },
  endDate: { required: true, message: "請選擇開始日期", trigger: "blur" },
});

const editHandle = (id) => {
  http.get("/emp/leave/info/" + id).then((res) => {
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const resetEditForm = () => {
  editForm = reactive({
    type: null,
    empId: null,
    reason: "",
    amount: 0,
    startDate: null,
    endDate: null,
  });
};

// TODO 測試取消重置表單
const cancelForm = (formEl) => {
  formEl.resetFields();
  visibleDialog.value = false;
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/emp/leave/" + (editForm.id ? "review" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getLeaveList();
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

const dialogOpenHandle = (key, data) => {
  formAction.value = "";
  if (key === "save") {
    formAction.value = "save";
    resetEditForm();
    visibleDialog.value = true;
  } else if (key === "review") {
    formAction.value = "review";
    resetEditForm();
    editHandle(data);
  }
};

const getLeaveList = () => {
  let startDate = null;
  let endDate = null;
  if (searchForm.dateRange) {
    startDate = searchForm.dateRange[0];
    endDate = searchForm.dateRange[1];
  }
  http
    .get("/emp/leave/list", {
      params: {
        empName: searchForm.empName,
        startDate: startDate,
        endDate: endDate,
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

// pagination
const currentPage = ref(1);
const pageSize = ref(20);
const pageSizes = ref([10, 20, 50, 100]);
const total = ref(0);
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  getLeaveList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  getLeaveList();
};

onBeforeMount(() => {
  getLeaveList();
  http.get("/emp/manage/list").then((res) => {
    empOption.value = res.data.records;
  });
});
</script>

<template>
  <el-form :inline="true" class="form-inline">
    <el-form-item>
      <el-input
        v-model="searchForm.empName"
        placeholder="搜尋名稱"
        clearable
      ></el-input>
    </el-form-item>
    <el-form-item>
      <el-date-picker
        v-model="searchForm.dateRange"
        type="daterange"
        value-format="YYYY-MM-DD"
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
    <el-table-column prop="jobName" label="職務" />
    <el-table-column prop="type" label="請假類型">
      <template #="scoped"> </template>
    </el-table-column>
    <el-table-column prop="amount" label="申請補助費用" />
    <el-table-column prop="startDate" label="開始時間" />
    <el-table-column prop="endDate" label="結束時間" />
    <el-table-column prop="status" label="狀態">
      <template #="scoped">
        <el-tag type="error" size="small" v-if="scoped.row.status == 2">
          退回
        </el-tag>
        <el-tag type="success" size="small" v-if="scoped.row.status == 1">
          通過
        </el-tag>
        <el-tag type="warning" size="small" v-if="scoped.row.status == 0">
          待審核
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="action" label="操作">
      <template #="scoped">
        <el-button
          v-if="hasAuth('emp:leave:review')"
          type="primary"
          @click="dialogOpenHandle('review', scoped.row.id)"
          link
          >審核</el-button
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
      <el-form-item prop="empId" label="員工姓名">
        <el-select
          v-model="editForm.empId"
          placeholder="請選擇員工"
          v-if="formAction === 'save'"
        >
          <el-option
            v-for="item in empOption"
            :key="item.id"
            :label="item.empName"
            :value="item.id"
          />
        </el-select>
        <span v-if="formAction === 'review'">
          {{ editForm.empName }}
        </span>
      </el-form-item>
      <el-form-item prop="type" label="請假類型">
        <el-select
          v-model="editForm.type"
          placeholder="請選擇員工"
          v-if="formAction === 'save'"
        >
          <el-option
            v-for="(item, index) in typeOption"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
        <span v-if="formAction === 'review'">
          {{ editForm.type }}
        </span>
      </el-form-item>
      <el-form-item prop="reason" label="請假原因">
        <el-input v-model="editForm.reason" v-if="formAction === 'save'" />
        <span v-if="formAction === 'review'">
          {{ editForm.reason }}
        </span>
      </el-form-item>
      <el-form-item prop="amount" label="申請補助費">
        <el-input-number
          v-model="editForm.amount"
          :min="0"
          v-if="formAction === 'save'"
        />
        <span v-if="formAction === 'review'">
          {{ editForm.amount }}
        </span>
      </el-form-item>
      <el-form-item prop="startDate" label="開始日期">
        <el-date-picker
          v-if="formAction === 'save'"
          v-model="editForm.startDate"
          type="datetime"
          placeholder="請選擇開始日期"
          format="YYYY/MM/DD HH:mm:ss"
        />
        <span v-if="formAction === 'review'">
          {{ editForm.startDate }}
        </span>
      </el-form-item>
      <el-form-item prop="endDate" label="結束日期">
        <el-date-picker
          v-if="formAction === 'save'"
          v-model="editForm.endDate"
          type="datetime"
          placeholder="請選擇結束日期"
          format="YYYY/MM/DD HH:mm:ss"
        />
        <span v-if="formAction === 'review'">
          {{ editForm.endDate }}
        </span>
      </el-form-item>
      <el-form-item label="審核" prop="status" v-if="formAction === 'review'">
        <el-radio-group v-model="editForm.status">
          <el-radio :label="0">待審核</el-radio>
          <el-radio :label="1">通過</el-radio>
          <el-radio :label="2">退回</el-radio>
        </el-radio-group>
      </el-form-item>

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
