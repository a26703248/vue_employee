<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import http from "@/axios/index.js";
import { hasAuth } from "@/glob/globalFunc.js";

// table
let searchForm = reactive({});
const tableData = ref([]);
const multipleTableRef = ref();

const getDeptList = () => {
  http
    .get("/dept/manage/list", {
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
const dialogOpenHandle = (key, data) => {
  if (key === "save") {
    resetEditForm();
    visibleDialog.value = true;
  } else if (key === "update") {
    resetEditForm();
    editHandle(data);
  }
};

// form
const labelPosition = ref("right");
const editFormRefs = ref(null);

let editForm = reactive({
  deptName: "",
  tel: "",
  description: "",
  status: 1,
});

const editRule = reactive({
  deptName: [{ required: true, message: "請輸入部門名稱", trigger: "blur" }],
});

const editHandle = (id) => {
  http.get("/dept/manage/info/" + id).then((res) => {
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const submitForm = async (formEl) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/dept/manage/" + (editForm.id ? "update" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getDeptList();
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
    deptName: "",
    tel: "",
    description: "",
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
  getDeptList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  getDeptList();
};

// life cycle
onBeforeMount(() => {
  getDeptList();
});
</script>

<template>
  <div>
    <!-- table -->
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-input
          v-model="searchForm.deptName"
          placeholder="搜尋員工名稱"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="getDeptList()">搜索</el-button>
      </el-form-item>
      <el-form-item v-if="hasAuth('dept:manage:save')">
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
      <el-table-column prop="deptSequence" label="部門編號" width="120" />
      <el-table-column prop="deptName" label="部門名稱" width="120" />
      <el-table-column prop="tel" label="聯絡電話" />
      <el-table-column prop="description" label="敘述" />
      <el-table-column prop="created" label="建立日期" />
      <el-table-column prop="updated" label="更新日期" />
      <el-table-column prop="status" label="狀態">
        <template #="scoped">
          <el-tag
            type="success"
            size="small"
            v-if="scoped.row.status === 1"
            >正常</el-tag
          >
          <el-tag
            type="error"
            size="small"
            v-else-if="scoped.row.status === 0"
            >禁止</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="action" label="操作" width="90">
        <template #="scoped">
          <el-button
            v-if="hasAuth('dept:manage:update')"
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
      title="編輯部門"
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
        <el-form-item label="部門名稱" prop="deptName">
          <el-input v-model="editForm.deptName" />
        </el-form-item>
        <el-form-item label="聯絡電話" prop="tel">
          <el-input v-model="editForm.tel" />
        </el-form-item>
        <el-form-item label="敘述" prop="description">
          <el-input v-model="editForm.description" />
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
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
