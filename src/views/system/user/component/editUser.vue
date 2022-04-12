<template>
	<div class="system-edit-user-container">
		<el-dialog :title="(ruleForm.userId!==0?'修改':'添加')+'用户'" v-model="isShowDialog" width="769px">
			<el-form ref="formRef" :model="ruleForm" :rules="rules" size="default" label-width="90px">
				<el-row :gutter="35">
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="ruleForm.userId===0">
						<el-form-item label="用户名" prop="userName">
							<el-input v-model="ruleForm.userName" placeholder="请输入账户名称" clearable></el-input>
						</el-form-item>
					</el-col>
          <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20" v-if="ruleForm.userId===0">
            <el-form-item label="账户密码" prop="password">
              <el-input v-model="ruleForm.password" placeholder="请输入" type="password" clearable></el-input>
            </el-form-item>
          </el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户昵称" prop="nickName">
							<el-input v-model="ruleForm.nickName" placeholder="请输入用户昵称" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="关联角色" prop="roleIds">
							<el-select v-model="ruleForm.roleIds" placeholder="请选择" clearable class="w100" multiple>
								<el-option
                    v-for="role in roleList"
                    :key="'role-'+role.id"
                    :label="role.name"
                    :value="role.id">
                </el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="部门" prop="deptId">
							<el-cascader
								:options="deptData"
								:props="{ checkStrictly: true,emitPath: false, value: 'deptId', label: 'deptName' }"
								placeholder="请选择部门"
								clearable
								class="w100"
								v-model="ruleForm.deptId"
							>
								<template #default="{ node, data }">
									<span>{{ data.deptName }}</span>
									<span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
								</template>
							</el-cascader>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="手机号" prop="mobile">
							<el-input v-model="ruleForm.mobile" placeholder="请输入手机号" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="ruleForm.email" placeholder="请输入" clearable></el-input>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="性别" prop="sex">
							<el-select v-model="ruleForm.sex" placeholder="请选择" clearable class="w100">
								<el-option
                   v-for="gender in genderData"
                   :key="'gender-'+gender.value"
                   :label="gender.label"
                   :value="gender.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="岗位" prop="postIds">
              <el-select v-model="ruleForm.postIds" placeholder="请选择" clearable class="w100" multiple>
                <el-option
                    v-for="post in postList"
                    :key="'post-'+post.postId"
                    :label="post.postName"
                    :value="post.postId">
                </el-option>
              </el-select>
						</el-form-item>
					</el-col>
					<el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb20">
						<el-form-item label="用户状态">
							<el-switch v-model="ruleForm.status" inline-prompt :active-value="1" :inactive-value="0" active-text="启" inactive-text="禁"></el-switch>
						</el-form-item>
					</el-col>
          <el-col :span="24">
            <el-form-item label="用户类型">
              <el-radio-group v-model="ruleForm.isAdmin">
                <el-radio
                    :label="1"
                >后台管理员</el-radio>
                <el-radio
                    :label="0"
                >前台用户</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
					<el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="mb20">
						<el-form-item label="用户描述">
							<el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入用户描述" maxlength="150"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="onCancel" size="default">取 消</el-button>
					<el-button type="primary" @click="onSubmit" size="default">{{ruleForm.userId!==0?'修 改':'添 加'}}</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts">
import { reactive, toRefs, onMounted, defineComponent,ref,unref } from 'vue';
import {getParams, addUser, editUser, getEditUser} from "/@/api/system/user";
import {ElMessage} from "element-plus";


export default defineComponent({
	name: 'systemEditUser',
  props:{
    deptData:{
      type:Array,
      default:()=>[]
    },
    genderData:{
      type:Array,
      default:()=>[]
    }
  },
	setup(prop,{emit}) {
    const roleList = ref([]);
    const postList = ref([]);
    const formRef = ref<HTMLElement | null>(null);
		const state = reactive({
			isShowDialog: false,
			ruleForm: {
        userId: 0,
        deptId: 0,
        userName: '',
        nickName: '',
        password: '',
        mobile:'',
        email: '',
        sex: '',
        status: 1,
        remark: '',
        postIds: [],
        roleIds: [],
        isAdmin:0,
			},
      //表单校验
      rules: {
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
      }
		});
		// 打开弹窗
		const openDialog = (row?:any) => {
      resetForm()
      if(row) {
        getEditUser(row.id).then((res:any)=>{
          const user = res.data.user;
          state.ruleForm = {
            userId: user.id,
            deptId: user.deptId,
            userName: user.userName,
            nickName: user.userNickname,
            password: '-',
            mobile:user.mobile,
            email: user.userEmail,
            sex: String(user.sex),
            status: user.userStatus,
            remark: user.remark,
            postIds: res.data.checkedPosts??[],
            roleIds: res.data.checkedRoleIds??[],
            isAdmin:user.isAdmin,
          };
        })
      }
			state.isShowDialog = true;
		};
		// 关闭弹窗
		const closeDialog = () => {
			state.isShowDialog = false;
		};
		// 取消
		const onCancel = () => {
			closeDialog();
		};
		// 新增
		const onSubmit = () => {
      const formWrap = unref(formRef) as any;
      if (!formWrap) return;
      formWrap.validate((valid: boolean) => {
        if (valid) {
          if(state.ruleForm.userId===0){
            //添加
            addUser(state.ruleForm).then(()=>{
              ElMessage.success('用户添加成功');
              closeDialog(); // 关闭弹窗
              emit('getUserList')
            });
          }else{
            //修改
            editUser(state.ruleForm).then(()=>{
              ElMessage.success('用户修改成功');
              closeDialog(); // 关闭弹窗
              emit('getUserList')
            });
          }
        }
      });
		};
		// 初始化部门数据
		const initTableData = () => {
      //获取角色岗位选项
      getParams().then((res:any)=>{
        roleList.value = res.data.roleList??[];
        postList.value = res.data.posts??[];
      });
		};
		// 页面加载时
		onMounted(() => {
			initTableData();
		});
    const resetForm = ()=>{
      state.ruleForm = {
        userId: 0,
        deptId: 0,
        userName: '',
        nickName: '',
        password: '',
        mobile:'',
        email: '',
        sex: '',
        status: 1,
        remark: '',
        postIds: [],
        roleIds: [],
        isAdmin:0,
      }
    };
		return {
			openDialog,
			closeDialog,
			onCancel,
			onSubmit,
      roleList,
      postList,
      formRef,
			...toRefs(state),
		};
	},
});
</script>
