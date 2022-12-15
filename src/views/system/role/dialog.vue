<template>
	<div class="system-edit-role-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="roleDialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色名称" prop="name">
							<el-input v-model="state.ruleForm.name" placeholder="请输入角色名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序">
							<el-input-number v-model="state.ruleForm.listOrder" :min="0" controls-position="right"
								placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="角色状态">
							<el-switch v-model="state.ruleForm.status" :active-value="1" :inactive-value="0"
								inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="角色描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入角色描述"
								maxlength="150"></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="菜单权限">
							<el-row :gutter="35">
								<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
									<el-checkbox v-model="state.menuExpand"
										@change="handleCheckedTreeExpand($event)">展开/折叠</el-checkbox>
									<el-checkbox v-model="state.menuNodeAll"
										@change="handleCheckedTreeNodeAll($event)">全选/全不选</el-checkbox>
									<el-checkbox v-model="state.menuCheckStrictly"
										@change="handleCheckedTreeConnect($event)">父子联动</el-checkbox>
								</el-col>
								<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
									<el-tree :data="state.menuData" ref="menuRef" :props="state.menuProps"
										:default-checked-keys="state.ruleForm.menuIds" node-key="id" show-checkbox
										class="menu-data-tree tree-border" :check-strictly="!state.menuCheckStrictly" />
								</el-col>
							</el-row>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(roleDialogFormRef)" size="default"
						:loading="state.loading">{{ state.dialog.submitTxt }}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemEditRole">
import type { FormInstance, FormRules } from 'element-plus'
import { reactive, ref } from 'vue';
import { ElMessage } from "element-plus";
import { getBackEndControlRoutes } from "/@/router/backEnd";
import { addRole,editRole, getRole, getRoleParams } from "/@/api/system/role";
import { handleTree } from "/@/utils/gfast";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);
// 定义接口来定义对象的类型
interface MenuDataTree {
	id: number;
	pid: number;
	title: string;
	children?: MenuDataTree[];
}
interface DialogRow {
	id: number;
	name: string;
	status: number;
	listOrder: number;
	remark: string;
	menuIds: Array<number>
}
interface RoleState {
	loading: boolean;
	isShowDialog: boolean;
	formData: DialogRow;
	menuData: Array<MenuDataTree>;
	menuExpand: boolean;
	menuNodeAll: boolean;
	menuCheckStrictly: boolean;
	menuProps: {
		children: string;
		label: string;
	};
	rules: object;
}

const menuRef = ref();
const rules = reactive<FormRules>({
	name: [
		{ required: true, message: "角色名称不能为空", trigger: "blur" },
	]
})
// 定义变量内容
const roleDialogFormRef = ref();
const state = reactive({
	loading: false,
	ruleForm: {
		id: 0,
		name: '',
		status: 1,
		listOrder: 0,
		remark: '',
		menuIds: []
	},
	menuData: [],
	menuExpand: false,
	menuNodeAll: false,
	menuCheckStrictly: false,
	menuProps: {
		children: 'children',
		label: 'title',
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, id: number) => {
	resetForm();
	getMenuData()
	state.dialog.type=type
	if (type === 'edit') {
		if (id) {
			getRole(id).then((res: any) => {
				if (res.data.role) {
					state.ruleForm = res.data.role;
					state.ruleForm.menuIds = res.data.menuIds ?? []
				}
			})
		}
		state.dialog.title = '修改角色';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增角色';
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.isShowDialog = true;
};
// 关闭弹窗
const closeDialog = () => {
	state.dialog.isShowDialog = false;
};
// 取消
const onCancel = () => {
	closeDialog();
};
// 新增
const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (!valid) {
			return;
		}

		if (state.dialog.type == 'edit') {
			//修改
			editRole(state.ruleForm).then(() => {
				ElMessage.success('角色修改成功');
				closeDialog(); // 关闭弹窗
				resetMenuSession()
				emit('refresh')
			}).finally(() => {
				state.loading = false;
			})
		} else {
			//添加
			addRole(state.ruleForm).then(() => {
				ElMessage.success('角色添加成功');
				closeDialog(); // 关闭弹窗
				resetMenuSession()
				emit('refresh');
			}).finally(() => {
				state.loading = false;
			})
		}
	})
};
const getMenuData = () => {
	getRoleParams().then((res: any) => {
		state.menuData = handleTree(res.data.menu, "id", "pid");
	})
};

const resetForm = () => {
	state.menuCheckStrictly = false;
	state.menuExpand = false;
	state.menuNodeAll = false;
	state.ruleForm = {
		id: 0,
		name: '',
		status: 1,
		listOrder: 0,
		remark: '',
		menuIds: []
	}
};
/** 树权限（展开/折叠）*/
const handleCheckedTreeExpand = (value: any) => {
	let treeList = state.menuData;
	for (let i = 0; i < treeList.length; i++) {
		menuRef.value.store.nodesMap[treeList[i].id].expanded = value;
	}
}

/** 树权限（全选/全不选） */
const handleCheckedTreeNodeAll = (value: any) => {
	menuRef.value.setCheckedNodes(value ? state.menuData : []);
}

/** 树权限（父子联动） */
const handleCheckedTreeConnect = (value: any) => {
	state.menuCheckStrictly = value ? true : false;
}

// 重置菜单session
const resetMenuSession = () => {
	getBackEndControlRoutes();
};

// 暴露变量
defineExpose({
	openDialog,
	resetMenuSession,
});
</script>

<style scoped lang="scss">
.tree-border {
	margin-top: 5px;
	border: 1px solid #e5e6e7!important;
	background: #fff none!important;
	border-radius: 4px;
  }
  .system-edit-role-container {
	  .menu-data-tree {
		  border: var(--el-input-border, var(--el-border-base));
		  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
		  padding: 5px;
	  }
  }
</style>
