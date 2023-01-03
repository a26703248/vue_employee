<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
import http from "@/axios/index.js";

// form
const size = ref("default");
const labelPosition = ref("right");
let editFormRefs = ref();

let editForm = reactive({
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

const editRule = reactive({
  parentId: { required: true, message: "請選擇上層選單", trigger: "blur" },
  name: { required: true, message: "請輸入名稱", trigger: "blur" },
  perms: { required: true, message: "請輸入權限代號", trigger: "blur" },
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
  orderNum: { required: true, message: "請輸入編號", trigger: "blur" },
});

const submitForm = async (formEl) => {
  console.log(editForm);
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      http
        .post("/sys/menu/" + (editForm.id ? "update" : "save"), editForm)
        .then((res) => {
          ElMessage({
            showClose: true,
            message: "操作成功",
            type: "success",
            onClose: () => {
              getMenuTree();
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

// dialog
const formDialog = ref();
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

// table
let tableData = ref([]);

const editHandle = (id) => {
  http.get("/sys/menu/info/" + id).then((res) => {
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const deleteHandle = (id) => {
  http.post("/sys/menu/delete/" + id).then((res) => {
    ElMessage({
      showClose: true,
      message: "操作成功",
      type: "success",
      onClose: () => {
        getMenuTree();
      },
    });
  });
};

const getMenuTree = () => {
  http.get("/sys/menu/list").then((res) => {
    tableData.value = res.data;
  });
};

onBeforeMount(() => {
  getMenuTree();
});

</script>

<template>
  <div>
    <!-- table -->
    <el-form :inline="true" class="form-inline">
      <el-form-item>
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
      default-expand-all
    >
      <el-table-column prop="name" label="名稱" />
      <el-table-column prop="perms" label="權限代號" />
      <el-table-column prop="icon" label="圖示" />
      <el-table-column prop="type" label="類型">
        <template #="scoped">
          <el-tag
            class="ml-2"
            v-if="scoped.row.type === 0"
            type="success"
            size="small"
            >目錄</el-tag
          >
          <el-tag
            class="ml-2"
            v-else-if="scoped.row.type === 1"
            type="warning"
            size="small"
            >選單</el-tag
          >
          <el-tag class="ml-2" v-else-if="scoped.row.type === 2" size="small"
            >操作</el-tag
          >
        </template>
      </el-table-column>
      <el-table-column prop="path" label="選單路徑" />
      <el-table-column prop="component" label="選單模組" />
      <el-table-column prop="orderNum" label="編號" />
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
            >編輯</el-button
          >
          <el-divider direction="vertical" />
          <el-popconfirm title="確定是否刪除" @confirm="deleteHandle(scoped.row.id)">
            <template #reference>
              <el-button
                type="primary"
                link
                >刪除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
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
        <el-form-item label="上層選單" prop="parentId">
          <el-select v-model="editForm.parentId" placeholder="請選擇上層選單">
            <template v-for="(item, index) in tableData" :key="index">
              <el-option :label="item.name" :value="item.id" />
              <template v-for="(children, index) in item.children" :key="index">
                <el-option :label="children.name" :value="children.id">
                  <span>{{ "- " + children.name }}</span>
                </el-option>
              </template>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="選單名稱" prop="name">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="權限代號" prop="perms">
          <el-input v-model="editForm.perms" />
        </el-form-item>
        <el-form-item label="圖示" prop="icon">
          <el-input v-model="editForm.icon" />
        </el-form-item>
        <el-form-item label="選單路徑" prop="path">
          <el-input v-model="editForm.path" />
        </el-form-item>
        <el-form-item label="選單模組" prop="component">
          <el-input v-model="editForm.component" />
        </el-form-item>
        <el-form-item label="類型" prop="type">
          <el-radio-group v-model="editForm.type">
            <el-radio :label="0">目錄</el-radio>
            <el-radio :label="1">選單</el-radio>
            <el-radio :label="2">操作</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="狀態" prop="status">
          <el-radio-group v-model="editForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="編號" prop="orderNum">
          <el-input-number :min="0" v-model="editForm.orderNum" />
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
.edit-form-button {
  text-align: right;
}
</style>
