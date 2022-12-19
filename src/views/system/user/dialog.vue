<template>
	<div class="system-edit-user-container">
		<el-dialog :title="state.dialog.title" v-model="state.dialog.isShowDialog" width="769px">
			<el-form ref="userDialogFormRef" :model="state.ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称" prop="nickName">
							<el-input v-model="state.ruleForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联角色" prop="roleIds">
							<el-select v-model="state.ruleForm.roleIds" placeholder="请选择" clearable class="w100"
								multiple>
								<el-option v-for="role in roleList" :key="'role-' + role.id" :label="role.name"
									:value="role.id">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门" prop="deptId">
							<el-cascader :options="deptData"
								:props="{ checkStrictly: true, emitPath: false, value: 'deptId', label: 'deptName' }"
								placeholder="请选择部门" clearable class="w100" v-model="state.ruleForm.deptId">
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号" prop="mobile">
							<el-input v-model="state.ruleForm.mobile" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="state.ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别" prop="sex">
							<el-select v-model="state.ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option v-for="gender in genderData" :key="'gender-' + gender.value"
									:label="gender.label" :value="gender.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="岗位" prop="postIds">
							<el-select v-model="state.ruleForm.postIds" placeholder="请选择" clearable class="w100"
								multiple>
								<el-option v-for="post in postList" :key="'post-' + post.postId" :label="post.postName"
									:value="post.postId">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="state.ruleForm.status" inline-prompt :active-value="1"
								:inactive-value="0" active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="用户类型">
							<el-radio-group v-model="state.ruleForm.isAdmin">
								<el-radio :label="1">后台管理员</el-radio>
								<el-radio :label="0">前台用户</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入用户描述"
								maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit(userDialogFormRef)" size="default">{{
							state.dialog.submitTxt
					}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="systemUserDialog">
import type { PostParamItem, RoleParamItem } from '/@/api/system/user/model';
import type { DeptTreeRow } from '/@/api/system/dept/model';
import type { SysDictDataMapItem } from '/@/api/system/dict/model';
import type { FormInstance, FormRules } from 'element-plus';

import { ref, reactive, onMounted, PropType } from 'vue';
import { ElMessage } from "element-plus";
import { getParams, addUser, editUser, getEditUser } from "/@/api/system/user";

defineProps({
	deptData: {
		type: Object as PropType<DeptTreeRow[]>,
		default: () => [] as DeptTreeRow[]
	},
	genderData: {
		type: Object as PropType<SysDictDataMapItem[]>,
		default: () => [] as SysDictDataMapItem[]
	}
})

// 定义子组件向父组件传值/事件
const emit = defineEmits(['refresh'])

const rules = reactive<FormRules>({
	userName: [
		{ required: true, message: "用户名称不能为空", trigger: "blur" }
	],
	nickName: [
		{ required: true, message: "用户昵称不能为空", trigger: "blur" }
	],
	deptId: [
		{ required: true, message: "归属部门不能为空", trigger: "blur" }
	],
	password: [
		{ required: true, message: "用户密码不能为空", trigger: "blur" }
	],
	email: [
		{
			type: "email",
			message: "'请输入正确的邮箱地址",
			trigger: ["blur", "change"]
		}
	],
	mobile: [
		{ required: true, message: "手机号码不能为空", trigger: "blur" },
		{
			pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
			message: "请输入正确的手机号码",
			trigger: "blur"
		}
	]
})
// 定义变量内容
const userDialogFormRef = ref();
const state = reactive({
	ruleForm: {
		userId: 0,
		deptId: 0,
		userName: '',
		nickName: '',
		password: '',
		mobile: '',
		email: '',
		sex: '',
		status: 1,
		remark: '',
		postIds: [] as number[],
		roleIds: [] as number[],
		isAdmin: 0,
	},
	dialog: {
		isShowDialog: false,
		type: '',
		title: '',
		submitTxt: '',
	},
});
const roleList = ref([] as RoleParamItem[]);
const postList = ref([] as PostParamItem[]);

// 打开弹窗
const openDialog = (type: string, id: number) => {
	resetForm();
	state.dialog.type = type;
	if (type === 'edit') {
		getEditUser(id).then((res: any) => {
			const user = res.data.user;
			state.ruleForm = {
				userId: user.id,
				deptId: user.deptId,
				userName: user.userName,
				nickName: user.userNickname,
				password: '-',
				mobile: user.mobile,
				email: user.userEmail,
				sex: String(user.sex),
				status: user.userStatus,
				remark: user.remark,
				postIds: res.data.checkedPosts ?? [],
				roleIds: res.data.checkedRoleIds ?? [],
				isAdmin: user.isAdmin,
			};
		})
		state.dialog.title = '修改用户';
		state.dialog.submitTxt = '修 改';
	} else {
		state.dialog.title = '新增用户';
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

// 提交
const onSubmit = async (formEl: FormInstance | undefined) => {
	if (!formEl) return
	await formEl.validate((valid, fields) => {
		if (!valid) {
			return;
		}

		if (state.dialog.type == 'edit') {
			//修改
			editUser(state.ruleForm).then(() => {
				ElMessage.success('用户修改成功');
				closeDialog(); // 关闭弹窗
				emit('refresh')
			});
		} else {
			//添加
			addUser(state.ruleForm).then(() => {
				ElMessage.success('用户添加成功');
				closeDialog(); // 关闭弹窗
				emit('refresh')
			});
		}
	})
};

// 初始化部门数据
const initTableData = () => {
	//获取角色岗位选项
	getParams().then((res: any) => {
		roleList.value = res.data.roleList ?? [];
		postList.value = res.data.posts ?? [];
	});
};
// 页面加载时
onMounted(() => {
	initTableData();
});
const resetForm = () => {
	state.ruleForm = {
		userId: 0,
		deptId: 0,
		userName: '',
		nickName: '',
		password: '',
		mobile: '',
		email: '',
		sex: '',
		status: 1,
		remark: '',
		postIds: [],
		roleIds: [],
		isAdmin: 0,
	}
};

// 暴露变量
defineExpose({
	openDialog,
});
</script>
