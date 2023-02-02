<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import http from "@/axios/index.js";
import { hasAuth } from "@/glob/globalFunc.js";

// table
let searchForm = reactive({});
const tableData = ref([]);
const multipleTableRef = ref();

const getBusinessList = () => {
  http
    .get("/emp/business/list", {
      params: {
        deptName: searchForm.deptName,
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
const formAction = ref("");
const dialogOpenHandle = (key, data) => {
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

// form
const labelPosition = ref("right");
const editFormRefs = ref(null);
const typeOption = ref([
  { id: 0, label: "訪問調查" },
  { id: 1, label: "駐點" },
  { id: 2, label: "出差" },
  { id: 3, label: "其他" },
]);

let editForm = reactive({
  companyName: "",
  type: 0,
  address: "",
  description: "",
  startDate: null,
  endDate: null,
  amount: 0,
  empId: 0,
});

const editRule = reactive({
  companyName: [{ required: true, message: "請輸入部門名稱", trigger: "blur" }],
  type: [{ required: true, message: "請輸入部門名稱", trigger: "blur" }],
  startDate: [{ required: true, message: "請輸入開始時間", trigger: "blur" }],
});

const editHandle = (id) => {
  http.get("/emp/business/info/" + id).then((res) => {
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/emp/business/" + (editForm.id ? "review" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getBusinessList();
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
    companyName: "",
    type: 0,
    address: "",
    description: "",
    startDate: null,
    endDate: null,
    amount: 0,
    empId: 0,
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
  getBusinessList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  getBusinessList();
};

// life cycle
onBeforeMount(() => {
  getBusinessList();
  // http.get("/emp/manage/list").then((res) => {
  //   res.data.records.forEach(e => {
  //   });
  // });
});
</script>

<template>
  <div>
    <!-- table -->
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-input
          v-model="searchForm.companyName"
          placeholder="搜尋公司名稱"
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
        <el-button type="info" @click="getBusinessList()">搜索</el-button>
      </el-form-item>
      <el-form-item v-if="hasAuth('emp:business:save')">
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
    >
      <el-table-column prop="businessSeq" label="部門編號" width="120" />
      <el-table-column prop="companyName" label="訪問公司名稱" width="120" />
      <el-table-column prop="address" label="敘述" />
      <el-table-column prop="description" label="敘述" />
      <el-table-column prop="amount" label="申請差旅費金額" />
      <el-table-column prop="dateRange" label="時間範圍">
        <template #="scoped">
          {{ `${scoped.row.startDate} - ${scoped.row.startDate}` }}
        </template>
      </el-table-column>
      <el-table-column prop="created" label="建立日期" />
      <el-table-column prop="status" label="審核狀態">
        <template #="scoped">
          <el-tag type="error" size="small" v-if="scoped.row.status === 2"
            >取消</el-tag
          >
          <el-tag type="success" size="small" v-if="scoped.row.status === 1"
            >通過</el-tag
          >
          <el-tag
            type="warning"
            size="small"
            v-else-if="scoped.row.status === 0"
            >待審核</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="90">
        <template #="scoped">
          <el-button
            v-if="hasAuth('dept:manage:review') && scoped.row.status === 0"
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
    <!-- create form -->
    <el-dialog
      title="新增派遣"
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
        <el-form-item
          label="派遣編號"
          prop="businessSeq"
          v-if="formAction == 'review'"
        >
          <template #="scoped">
            {{ scoped.row.businessSeq }}
          </template>
        </el-form-item>
        <el-form-item label="訪問公司" prop="companyName">
          <el-input
            v-model="editForm.companyName"
            v-if="formAction === 'save'"
          />
          <template v-if="formAction === 'review'" #="scoped">
            {{ scoped.row.companyName }}
          </template>
        </el-form-item>
        <el-form-item label="訪問地點" prop="address">
          <el-input
            v-model="editForm.companyName"
            v-if="formAction === 'save'"
          />
          <template v-if="formAction === 'review'" #="scoped">
            {{ scoped.row.companyName }}
          </template>
        </el-form-item>
        <el-form-item label="申請差旅費金額" prop="amount">
          <el-input
            v-model="editForm.companyName"
            v-if="formAction === 'save'"
          />
          <template v-if="formAction === 'review'" #="scoped">
            {{ scoped.row.companyName }}
          </template>
        </el-form-item>
        <el-form-item label="敘述" prop="description">
          <el-input
            v-model="editForm.companyName"
            v-if="formAction === 'save'"
          />
          <template v-if="formAction === 'review'" #="scoped">
            {{ scoped.row.companyName }}
          </template>
        </el-form-item>
        <el-form-item label="開始日期" prop="startDate">
          <el-input
            v-model="editForm.companyName"
            v-if="formAction === 'save'"
          />
          <template v-if="formAction === 'review'" #="scoped">
            {{ scoped.row.companyName }}
          </template>
        </el-form-item>
        <el-form-item label="結束日期" prop="endDate">
          <el-input
            v-model="editForm.companyName"
            v-if="formAction === 'save'"
          />
          <template v-if="formAction === 'review'" #="scoped">
            {{ scoped.row.companyName }}
          </template>
        </el-form-item>
        <el-form-item label="審核" prop="status" v-if="formAction === 'review'">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="0">待審核</el-radio>
            <el-radio :label="1">通過</el-radio>
            <el-radio :label="2">取消</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- button -->
        <el-form-item label-width="80" edit-form-button>
          <template #="scoped">
            <el-button @click="visibleDialog = false">取消</el-button>
            <el-button type="primary" @click="submitForm(editFormRefs)"
              >送出</el-button
            >
          </template>
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
