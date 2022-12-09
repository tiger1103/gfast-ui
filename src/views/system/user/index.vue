<template>
  <div class="system-user-container">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card shadow="hover">
          <el-aside>
            <el-scrollbar>
              <el-input :prefix-icon="Search" v-model="filterText" placeholder="请输入部门名称" clearable size="default"
                style="width: 80%;" />
              <el-tree ref="treeRef" class="filter-tree" :data="state.deptData" :props="state.deptProps"
                default-expand-all :filter-node-method="deptFilterNode" @node-click="handleNodeClick" />
            </el-scrollbar>
          </el-aside>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover">
          <div class="system-user-search mb15">
            <el-form :model="state.tableData.param" ref="queryRef" :inline="true" label-width="68px">
              <el-form-item label="关键字" prop="keyWords">
                <el-input v-model="state.tableData.param.keyWords" placeholder="请输入用户账号或姓名" clearable size="default"
                  style="width: 240px" @keyup.enter.native="userList" />
              </el-form-item>
              <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="state.tableData.param.mobile" placeholder="请输入手机号码" clearable size="default"
                  style="width: 240px" @keyup.enter.native="userList" />
              </el-form-item>
              <el-form-item label="状态" prop="status" style="width: 200px;">
                <el-select v-model="state.tableData.param.status" placeholder="用户状态" clearable size="default"
                  style="width: 240px">
                  <el-option label="启用" :value="1" />
                  <el-option label="禁用" :value="0" />
                </el-select>
              </el-form-item>
              <el-form-item label="创建时间" prop="dateRange">
                <el-date-picker v-model="state.tableData.param.dateRange" size="default" style="width: 240px"
                  value-format="YYYY-MM-DD" type="daterange" range-separator="-" start-placeholder="开始日期"
                  end-placeholder="结束日期"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button size="default" type="primary" class="ml10" @click="userList">
                  <el-icon>
                    <ele-Search />
                  </el-icon>
                  查询
                </el-button>
                <el-button size="default" @click="resetQuery(queryRef)">
                  <el-icon>
                    <ele-Refresh />
                  </el-icon>
                  重置
                </el-button>
                <el-button size="default" type="success" class="ml10" @click="onOpenAddUser">
                  <el-icon>
                    <ele-FolderAdd />
                  </el-icon>
                  新增用户
                </el-button>
                <el-button size="default" type="danger" class="ml10" @click="onRowDel()">
                  <el-icon>
                    <ele-Delete />
                  </el-icon>
                  删除用户
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <el-table :data="state.tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="userName" label="账户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNickname" label="用户昵称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dept.deptName" label="部门" show-overflow-tooltip></el-table-column>
            <el-table-column label="角色" align="center" prop="roleInfo" :show-overflow-tooltip="true">
              <template #default="scope">
                <span v-for="(item, index) of scope.row.roleInfo" :key="'role-' + index"> {{ item.name + ' ' }} </span>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userStatus" label="用户状态" show-overflow-tooltip>
              <template #default="scope">
                <el-switch v-model="scope.row.userStatus" inline-prompt :active-value="1" :inactive-value="0"
                  active-text="启" inactive-text="禁" @change="handleStatusChange(scope.row)">
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="150">
              <template #default="scope">
                <el-button size="small" link type="primary" @click="onOpenEditUser(scope.row)">修改</el-button>
                <el-button size="small" link type="primary" @click="onRowDel(scope.row)">删除</el-button>
                <el-button size="small" link type="primary" @click="handleResetPwd(scope.row)">重置</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination v-show="state.tableData.total > 0" :total="state.tableData.total"
            v-model:page="state.tableData.param.pageNum" v-model:limit="state.tableData.param.pageSize"
            @pagination="userList" />
        </el-card>
      </el-col>
    </el-row>
		<AddUer ref="addUserRef" :dept-data="state.deptData" :gender-data="sys_user_sex" @getUserList="userList" />
    <EditUser ref="editUserRef" :dept-data="state.deptData" :gender-data="sys_user_sex" @getUserList="userList" />
  </div>
</template>
<script setup lang="ts" name="apiV1SystemUserList">
import type { UserListItem } from '/@/api/system/user/model'
import { Search } from '@element-plus/icons-vue'
import { defineAsyncComponent, reactive, onMounted, ref } from 'vue';
import { ElMessageBox, ElMessage, ElTree, FormInstance } from 'element-plus';
import { useDict } from "/@/api/system/dict/data";
import { getUserList, getDeptTree, resetUserPwd, changeUserStatus, deleteUser } from '/@/api/system/user/index';

interface TableDataState {
  ids: number[];
  deptProps: {};
  deptData: any[];
  tableData: {
    data: UserListItem[];
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      deptId: string;
      mobile: string;
      status: string;
      keyWords: string;
      dateRange: string[];
    };
  };
}

const { sys_user_sex } = useDict('sys_user_sex')
// 引入组件
const AddUer = defineAsyncComponent(() => import('/@/views/system/user/component/addUser.vue'));
const EditUser = defineAsyncComponent(() => import('/@/views/system/user/component/editUser.vue'));

// 定义变量内容
const addUserRef = ref();
const editUserRef = ref();
const queryRef = ref<FormInstance>()
const filterText = ref('');
const treeRef = ref<InstanceType<typeof ElTree>>();

const state = reactive<TableDataState>({
  ids: [],
  deptProps: {
    id: "deptId",
    children: "children",
    label: "deptName"
  },
  deptData: [
    {
      label: '集团总部',
      children: [
        {
          label: '曲靖分部',
          children: [
            {
              label: '总经办',
            },
            {
              label: '市场部',
            },
            {
              label: '研发部',
            },
          ],
        },
      ],
    },
  ],
  tableData: {
    data: [],
    total: 0,
    loading: false,
    param: {
      pageNum: 1,
      pageSize: 10,
      deptId: '',
      mobile: '',
      status: '',
      keyWords: '',
      dateRange: []
    },
  },
});

// 初始化表格数据
const initTableData = () => {
  getDeptTree().then((res: any) => {
    state.deptData = res.data.deps
  })
  userList();
};

const userList = () => {
  getUserList(state.tableData.param).then((res: any) => {
    state.tableData.data = res.data.userList ?? [];
    state.tableData.total = res.data.total;
  });
};

// 打开新增用户弹窗
const onOpenAddUser = () => {
  addUserRef.value.openDialog();
};
// 打开修改用户弹窗
const onOpenEditUser = (row: UserListItem) => {
  editUserRef.value.openDialog(row.id);
};
// 删除用户
const onRowDel = (row: UserListItem | undefined=undefined) => {
  let msg = '你确定要删除所选用户？';
  let ids: number[] = [];
  if (row) {
    msg = `此操作将永久删除用户：“${row.userName}”，是否继续?`
    ids = [row.id]
  } else {
    ids = state.ids
  }
  if (ids.length === 0) {
    ElMessage.error('请选择要删除的数据。');
    return
  }
  ElMessageBox.confirm(msg, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteUser(ids).then(() => {
        ElMessage.success('删除成功');
        userList();
      })
    })
    .catch(() => { });
};

// 页面加载时
onMounted(() => {
  initTableData();
});

const deptFilterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.includes(value)
};
// 多选框选中数据
const handleSelectionChange = (selection: any[]) => {
  state.ids = selection.map(item => item.id)
};
// 节点单击事件
const handleNodeClick = (data: any) => {
  state.tableData.param.deptId = data.deptId;
  userList();
};
/** 重置密码按钮操作 */
const handleResetPwd = (row: any) => {
  ElMessageBox.prompt('请输入"' + row.userName + '"的新密码', "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消"
  }).then(({ value }) => {
    if (!value || value == '') {
      ElMessage.success('密码不能为空');
      return
    }
    resetUserPwd(row.id, value).then(() => {
      ElMessage.success("修改成功，新密码是：" + value);
    });
  }).catch(() => { });
};
// 用户状态修改
const handleStatusChange = (row: any) => {
  let text = row.userStatus === 1 ? "启用" : "停用";
  ElMessageBox.confirm('确认要"' + text + '"："' + row.userName + '"用户吗?', "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(function () {
    return changeUserStatus(row.id, row.userStatus);
  }).then(() => {
    ElMessage.success(text + "成功");
  }).catch(function () {
    row.userStatus = row.userStatus === 0 ? 1 : 0;
  });
};
/** 重置按钮操作 */
const resetQuery = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  userList()
};
</script>

<style scoped lang="scss">
.system-user-container {
  :deep(.el-card__body) {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: auto;

    .el-table {
      flex: 1;
    }
  }
}
</style>
