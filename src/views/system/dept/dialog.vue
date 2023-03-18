<template>
	<div class="system-edit-dept-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="ruleFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="上级部门">
							<el-cascader :options="state.deptData"
								:props="{ checkStrictly: true, emitPath: false, value: 'deptId', label: 'deptName' }"
								placeholder="请选择部门" clearable class="w100" v-model="state.ruleForm.parentId">
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门名称">
							<el-input v-model="state.ruleForm.deptName" placeholder="请输入部门名称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="负责人">
							<el-input v-model="state.ruleForm.leader" placeholder="请输入负责人" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号">
							<el-input v-model="state.ruleForm.phone" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="排序">
							<el-input-number v-model="state.ruleForm.orderNum" :min="0" :max="999"
								controls-position="right" placeholder="请输入排序" class="w100" />
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门状态">
							<el-switch v-model="state.ruleForm.status" :active-value="1" :inactive-value="0"
								inline-prompt active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(ruleFormRef)" size="default">{{
							state.dialog.submitTxt
					}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemDeptDialog">
import { ref, reactive, onMounted } from 'vue';
import type { DeptTreeRow } from '/@/api/system/dept/model';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage } from "element-plus";
import { addDept, editDept, getDeptList } from "/@/api/system/dept";
import { handleTree } from "/@/utils/gfast";

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh']);

const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
	deptName: [
		{ required: true, message: "部门名称不能为空", trigger: "blur" },
	]
})

// 定义变量内容
const state = reactive({
	ruleForm: {
		deptId: 0,
		parentId: 0, // 上级部门
		deptName: '', // 部门名称
		orderNum: 0,
		leader: '',
		phone: '',
		email: '',
		status: 1,
	},
	deptData: [] as DeptTreeType[], // 部门数据
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});

// 打开弹窗
const openDialog = (type: string, row: DeptTreeRow) => {
	resetForm()
	if (row && typeof row === "object") {
		state.ruleForm = row;
	} else if (row && typeof row === 'number') {
		state.ruleForm.parentId = row
	}
	if (type === 'edit') {
		state.dialog.title = '修改部门';
		state.dialog.submitTxt = '修 改';
		getDeptList().then((res: any) => {
			state.deptData = handleTree(res.data.deptList ?? [], "deptId", "parentId");
		});
	} else {
		state.dialog.title = '新增部门';
		state.dialog.submitTxt = '新 增';
	}
	state.dialog.type=type;
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

		if (state.ruleForm.deptId > 0) {
			//修改
			editDept(state.ruleForm).then(() => {
				ElMessage.success('部门修改成功');
				closeDialog(); // 关闭弹窗
				emit('refresh')
			});
		} else {
			//添加
			addDept(state.ruleForm).then(() => {
				ElMessage.success('部门添加成功');
				closeDialog(); // 关闭弹窗
				emit('refresh')
			});
		}
	})
};

const resetForm = () => {
	state.ruleForm = {
		deptId: 0,
		parentId: 0, // 上级部门
		deptName: '', // 部门名称
		orderNum: 0,
		leader: '',
		phone: '',
		email: '',
		status: 1,
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
