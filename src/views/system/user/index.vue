<template>
	<div class="system-user-container">
    <el-row :gutter="10">
      <el-col :span="4">
        <el-card shadow="hover">
          <el-aside>
            <el-scrollbar>
              <el-input :prefix-icon="search" v-model="filterText" placeholder="请输入部门名称" clearable size="default" style="width: 80%;"/>
              <el-tree
                  ref="treeRef"
                  class="filter-tree"
                  :data="deptData"
                  :props="deptProps"
                  default-expand-all
                  :filter-node-method="deptFilterNode"
              />
            </el-scrollbar>
          </el-aside>
        </el-card>
      </el-col>
      <el-col :span="20">
        <el-card shadow="hover">
          <div class="system-user-search mb15">
            <el-input size="default" placeholder="请输入用户名称" style="max-width: 180px"> </el-input>
            <el-button size="default" type="primary" class="ml10">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddUser">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增用户
            </el-button>
          </div>
          <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column type="index" label="序号" width="60" />
            <el-table-column prop="userName" label="账户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userNickname" label="用户昵称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="dept.deptName" label="部门" show-overflow-tooltip></el-table-column>
            <el-table-column label="角色" align="center" prop="roleInfo" :show-overflow-tooltip="true" >
              <template #default="scope">
                <span v-for="(item,index) of scope.row.roleInfo" :key="'role-'+index">   {{item.name}}   </span>
              </template>
            </el-table-column>
            <el-table-column prop="mobile" label="手机号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="userStatus" label="用户状态" show-overflow-tooltip>
              <template #default="scope">
                <el-tag type="success" v-if="scope.row.userStatus===1">启用</el-tag>
                <el-tag type="info" v-else>禁用</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button :disabled="scope.row.userName === 'admin'" size="small" type="text" @click="onOpenEditUser(scope.row)">修改</el-button>
                <el-button :disabled="scope.row.userName === 'admin'" size="small" type="text" @click="onRowDel(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
              v-show="tableData.total>0"
              :total="tableData.total"
              v-model:page="tableData.param.pageNum"
              v-model:limit="tableData.param.pageSize"
              @pagination="userList"
          />
        </el-card>
      </el-col>
    </el-row>
		<AddUer ref="addUserRef" />
		<EditUser ref="editUserRef" />
	</div>
</template>

<script lang="ts">
import {toRefs, reactive, onMounted, ref, defineComponent,watch,getCurrentInstance} from 'vue';
import {ElMessageBox, ElMessage, ElTree} from 'element-plus';
import { Search } from '@element-plus/icons-vue'
import AddUer from '/@/views/system/user/component/addUser.vue';
import EditUser from '/@/views/system/user/component/editUser.vue';
import {getUserList} from '/@/api/system/user/index';

interface TableDataState {
  ids:number[];
  // 日期范围
  dateRange: string[];
  deptProps:{};
  deptData:any[];
	tableData: {
		data: any[];
		total: number;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
      mobile:string;
      status:string;
      keyWords:string;
      beginTime:string;
      endTime:string;
		};
	};
}

export default defineComponent({
	name: 'systemUser',
	components: { AddUer, EditUser },
	setup() {
    const {proxy} = getCurrentInstance() as any;
    const {sys_user_sex} = proxy.useDict('sys_user_sex')
		const addUserRef = ref();
		const editUserRef = ref();
    const filterText = ref('');
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const search = Search
		const state = reactive<TableDataState>({
      ids:[],
      dateRange:[],
      deptProps:{
        children: 'children',
        label: 'label',
      },
      deptData:[
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
          mobile:'',
          status:'',
          keyWords:'',
          beginTime:'',
          endTime:''
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
      userList();
		};
    const userList = ()=>{
      getUserList(state.tableData.param).then((res:any)=>{
        state.tableData.data = res.data.userList;
        state.tableData.total = res.data.total;
      });
    };
		// 打开新增用户弹窗
		const onOpenAddUser = () => {
			addUserRef.value.openDialog();
		};
		// 打开修改用户弹窗
		const onOpenEditUser = (row:any) => {
			editUserRef.value.openDialog(row);
		};
		// 删除用户
		const onRowDel = (row:any) => {
			ElMessageBox.confirm(`此操作将永久删除账户名称：“${row.userName}”，是否继续?`, '提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					ElMessage.success('删除成功');
				})
				.catch(() => {});
		};
		// 分页改变
		const onHandleSizeChange = (val: number) => {
			state.tableData.param.pageSize = val;
		};
		// 分页改变
		const onHandleCurrentChange = (val: number) => {
			state.tableData.param.pageNum = val;
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
    watch(filterText, (val) => {
      treeRef.value!.filter(val)
    });
    const deptFilterNode = (value: string, data:any) => {
      if (!value) return true;
      return data.label.includes(value)
    };
    // 多选框选中数据
    const handleSelectionChange = (selection:any[])=> {
      state.ids = selection.map(item => item.postId)
    };
		return {
			addUserRef,
			editUserRef,
			onOpenAddUser,
			onOpenEditUser,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
      deptFilterNode,
      filterText,
      treeRef,
      search,
      sys_user_sex,
      userList,
      handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
