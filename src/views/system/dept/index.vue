<template>
	<div class="system-dept-container">
		<el-card shadow="hover">
			<div class="system-dept-search mb15">
				<el-input size="default" placeholder="请输入部门名称" style="max-width: 180px"> </el-input>
				<el-button size="default" type="primary" class="ml10">
					<el-icon>
						<ele-Search />
					</el-icon>
					查询
				</el-button>
				<el-button size="default" type="success" class="ml10" @click="onOpenAddDept">
					<el-icon>
						<ele-FolderAdd />
					</el-icon>
					新增部门
				</el-button>
			</div>
			<el-table
				:data="tableData.data"
				style="width: 100%"
				row-key="deptId"
				default-expand-all
				:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
			>
				<el-table-column prop="deptName" label="部门名称" show-overflow-tooltip> </el-table-column>
				<el-table-column prop="status" label="部门状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status===1">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="orderNum" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" show-overflow-tooltip width="140">
					<template #default="scope">
						<el-button size="small" type="text" @click="onOpenAddDept">新增</el-button>
						<el-button size="small" type="text" @click="onOpenEditDept(scope.row)">修改</el-button>
						<el-button size="small" type="text" @click="onTabelRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<EditDept ref="editDeptRef" />
	</div>
</template>

<script lang="ts">
import { ref, toRefs, reactive, onMounted, defineComponent,getCurrentInstance } from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditDept from '/@/views/system/dept/component/editDept.vue';
import {getDeptList} from "/@/api/system/dept";

// 定义接口来定义对象的类型
interface TableDataRow {
  deptId:number;
  parentId:number;
  deptName:string;
  status:number;
  orderNum:number;
  createdAt:string;
	children?:TableDataRow[];
}
interface TableDataState {
	tableData: {
		data: Array<TableDataRow>;
		loading: boolean;
		param: {
			pageNum: number;
			pageSize: number;
		};
	};
}

export default defineComponent({
	name: 'systemDept',
	components: { EditDept },
	setup() {
    const {proxy} = getCurrentInstance() as any;
		const editDeptRef = ref();
		const state = reactive<TableDataState>({
			tableData: {
				data: [],
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
      deptList();
		};
    const deptList = ()=>{
      getDeptList(state.tableData.param).then((res:any)=>{
        state.tableData.data = proxy.handleTree(res.data.deptList??[], "deptId","parentId");
      });
    };
		// 打开新增菜单弹窗
		const onOpenAddDept = () => {
      editDeptRef.value.openDialog();
		};
		// 打开编辑菜单弹窗
		const onOpenEditDept = (row: TableDataRow) => {
			editDeptRef.value.openDialog(row);
		};
		// 删除当前行
		const onTabelRowDel = (row: TableDataRow) => {
			ElMessageBox.confirm(`此操作将永久删除部门：${row.deptName}, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					ElMessage.success('删除成功');
				})
				.catch(() => {});
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
		return {
			editDeptRef,
			onOpenAddDept,
			onOpenEditDept,
			onTabelRowDel,
			...toRefs(state),
		};
	},
});
</script>
