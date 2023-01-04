<script setup>
import { reactive, ref, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";
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

const getRoleList = () => {
  http
    .get("/sys/role/list", {
      params: {
        name: searchForm.name,
        currentPage: currentPage.value,
        size: pageSize.value,
      },
    })
    .then((res) => {
      tableData.value = res.data.records;
      size.value = res.data.pageSize;
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
  http.post("/sys/role/delete", data).then((res) => {
    ElMessage({
      showClose: true,
      message: "操作成功",
      type: "success",
      onClose: () => {
        getRoleList();
      },
    });
  });
};

// dialog
const visibleDialog = ref(false);
const permVisibleDialog = ref(false);
const dialogOpenHandle = (key, data) => {
  if (key === "save") {
    resetEditForm();
    visibleDialog.value = true;
  } else if (key === "update") {
    resetEditForm();
    editHandle(data);
  } else if (key === "permHandle") {
    permHandle(data);
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
    editForm = reactive(res.data);
    visibleDialog.value = true;
  });
};

const submitForm = async (formEl) => {
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
              getRoleList();
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

let permFormRefs = ref(null);
let permForm = reactive({});

const permHandle = (id) => {
    permVisibleDialog.value = true;
    http.get("/sys/role/info" + id).then(res => {
      permDialogTree.value.setCheckedKeys(res.data.menuIds)
      permForm = res.data.info;
    })
}

// TODO 分頁功能
// pagination
const currentPage = ref(4);
const pageSize = ref(10);
const pageSizes = ref([10, 20, 50, 100]);
const total = ref(0);
const handleSizeChange = (val) => {
  console.log(`${val} items per page`);
  pageSize.value = val;
  getRoleList();
};

const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`);
  currentPage.value = val;
  getRoleList();
};

// tree
const permDialogTree = ref(null);
const defaultProps = {
  children: "children",
  label: "name",
};

const permData = ref([
  {
    id: 1,
    label: "Level one 1",
    children: [
      {
        id: 4,
        label: "Level two 1-1",
        children: [
          {
            id: 9,
            label: "Level three 1-1-1",
          },
          {
            id: 10,
            label: "Level three 1-1-2",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Level one 2",
    children: [
      {
        id: 5,
        label: "Level two 2-1",
      },
      {
        id: 6,
        label: "Level two 2-2",
      },
    ],
  },
  {
    id: 3,
    label: "Level one 3",
    children: [
      {
        id: 7,
        label: "Level two 3-1",
      },
      {
        id: 8,
        label: "Level two 3-2",
      },
    ],
  },
]);

const submitPermFormHandle = () => {
  let menuIds = permDialogTree.value.getCheckedKeys();
  let formData = new FormData();
  formData.append("menuIds", menuIds)
  http.post("/sys/role/perm/" + permFormRefs.id, formData).then(res => {
    ElMessage({
      showClose:true,
      type:"success",
      message:"操作成功",
      onClose:()=> {
        getRoleList();
      }
    })
    permVisibleDialog.value = false;
  });
}

// life cycle
onBeforeMount(() => {
  getRoleList();
  http.get("/sys/menu/list").then((res) => {
    permData.value = res.data;
  });
});

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
        <el-button type="info" @click="getRoleList()">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="dialogOpenHandle('save')">新增</el-button>
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
            @click="dialogOpenHandle('permHandle', scoped.row.id)"
            link
            >分配權限</el-button
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
    <!-- form -->
    <el-dialog
      title="新增"
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
    <el-dialog
      title="分配權限"
      ref="permDialog"
      v-model="permVisibleDialog"
      width="30%"
    >
      <el-form ref="permFormRefs" v-model="permForm">
        <el-tree
          ref="permDialogTree"
          :props="defaultProps"
          :data="permData"
          :default-expand-all="true"
          show-checkbox
          node-key="id"
          :check-strictly="true"
        />
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permVisibleDialog = false">取消</el-button>
          <el-button type="primary" @click="submitPermFormHandle()">
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
