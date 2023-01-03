<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import http from "@/axios/index.js";

// table
let searchForm = reactive({});
const batchDeleteDis = ref(false);
const tableData = [
  {
    name: "外部使用者",
    code: "anonymous",
    description: "text1",
    status: 1,
  },
  {
    name: "管理者",
    code: "admin",
    description: "text2",
    status: 1,
  },
];
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
};
const getRoleTable = () => {
  http.get("/sys/role/list").then((res) => {
    tableData.value = res.data;
  });
};
const deleteHandle = (id) => {
  console.log(id)
  http.post("/sys/role/delete/" + id).then((res) => {
    ElMessage({
      showClose: true,
      message: "操作成功",
      type: "success",
      onClose: () => {
        getRoleTable();
      },
    });
  });
};

onBeforeMount(() => {
  getRoleTable();
});

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
const size = ref("default");
const labelPosition = ref("right");
let editFormRefs = ref();

let editForm = reactive({
  name: "",
  code: "",
  description: "",
  status: 1,
});

const editRule = reactive({
  name: { required: true, message: "請輸入名稱", trigger: "blur" },
  code: { required: true, message: "請輸入唯一編號", trigger: "blur" },
  description: {},
  status: {
    required: true,
    message: "請選擇狀態",
    trigger: "change",
  },
});

const editHandle = (id) => {
  http.get("/sys/role/info/" + id).then((res) => {
    // TODO 串接後端時開啟
    // editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const submitForm = async (formEl) => {
  console.log(editForm);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/sys/role/" + (editForm.id ? "update" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getRoleTable();
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

// TODO 分頁功能
// pagination
const currentPage = ref(4);
const pageSize = ref(10);
const pageSizes = ref([10, 20, 50, 100]);
const total = ref(0);
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
};

</script>

<template>
  <div>
    <!-- table -->
    <el-form :inline="true" class="form-inline">
      <el-form-item>
        <el-input
          v-model="searchForm.name"
          placeholder="搜尋關鍵字"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="visibleDialog = true">新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-popconfirm title="確定是否批量刪除" @confirm="deleteHandle()">
          <template #reference>
            <el-button type="danger" :disabled="batchDeleteDis">批量刪除</el-button>
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
      <el-table-column prop="name" label="名稱" width="120" />
      <el-table-column
        prop="code"
        label="唯一編號"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip />
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
      <el-table-column prop="action" label="操作">
        <template #="scoped">
          <el-button
            type="primary"
            @click="dialogOpenHandle('update', scoped.row.id)"
            link
            >分配權限</el-button
          >
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
    <!-- form -->
    <el-dialog ref="formDialog" v-model="visibleDialog" width="30%">
      <el-form
        ref="editFormRefs"
        :model="editForm"
        :rules="editRule"
        label-width="auto"
        :label-position="labelPosition"
        :size="size"
      >
        <el-form-item label="角色名稱" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="唯一編號" prop="code">
          <el-input v-model="editForm.code" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
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
