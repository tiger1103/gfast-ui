<template>
  <!-- 操作日志详情抽屉 -->
  <div class="system-sysOperLog-detail">
    <el-drawer v-model="isShowDialog" size="80%" direction="ltr">
      <template #header>
        <h4>操作日志详情</h4>
      </template>
      <el-form ref="formRef" :model="formData" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志编号">{{ formData.operId }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="系统模块">{{ formData.title }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作方法">{{ formData.method }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求方式">{{ proxy.getOptionValue(formData.requestMethod, requestMethodOptions,'value','label') }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作人员">{{ formData.operName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门名称">{{formData.deptName}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求URL">{{ formData.operUrl }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主机地址">{{ formData.operIp }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作地点">{{ formData.operLocation }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求参数">{{ formData.operParam }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="错误消息">{{ formData.errorMsg }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间">{{ proxy.parseTime(formData.operTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-drawer>
  </div>
</template>
<script lang="ts">
import { reactive, toRefs, defineComponent,ref,getCurrentInstance,computed } from 'vue';
import {
  getSysOperLog
} from "/@/api/system/monitor/operLog";
import {
  SysOperLogInfoData,
  SysOperLogEditState,
} from "/@/views/system/monitor/operLog/component/model"
export default defineComponent({
  name:"apiV1SystemSysOperLogDetail",
  components:{
  },
  props:{
    requestMethodOptions:{
      type:Array,
      default:()=>[]
    },
  },
  setup(props,{emit}) {
    const {proxy} = <any>getCurrentInstance()
    const formRef = ref<HTMLElement | null>(null);
    const menuRef = ref();
    const state = reactive<SysOperLogEditState>({
      loading:false,
      isShowDialog: false,
      formData: {
        operId: undefined,
        title: undefined,
        businessType: undefined,
        method: undefined,
        requestMethod: undefined,
        operatorType: undefined,
        operName: undefined,
        deptName: undefined,
        operUrl: undefined,
        operIp: undefined,
        operLocation: undefined,
        operParam: undefined,
        jsonResult: undefined,
        status: false ,
        errorMsg: undefined,
        operTime: undefined,
        linkedSysOperLogSysDept: {
          deptId:undefined,    // 部门id
          deptName:undefined,    // 部门名称
        },
      },
      // 表单校验
      rules: {
        operId : [
          { required: true, message: "日志编号不能为空", trigger: "blur" }
        ],
        operName : [
          { required: true, message: "操作人员不能为空", trigger: "blur" }
        ],
        deptName : [
          { required: true, message: "部门名称不能为空", trigger: "blur" }
        ],
        status : [
          { required: true, message: "操作状态（0正常 1异常）不能为空", trigger: "blur" }
        ],
      }
    });
    // 打开弹窗
    const openDialog = (row?: SysOperLogInfoData) => {
      resetForm();
      if(row) {
        getSysOperLog(row.operId!).then((res:any)=>{
          const data = res.data;
          state.formData = data;
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
    const resetForm = ()=>{
      state.formData = {
        operId: undefined,
        title: undefined,
        businessType: undefined,
        method: undefined,
        requestMethod: undefined,
        operatorType: undefined,
        operName: undefined,
        deptName: undefined,
        operUrl: undefined,
        operIp: undefined,
        operLocation: undefined,
        operParam: undefined,
        jsonResult: undefined,
        status: false ,
        errorMsg: undefined,
        operTime: undefined,
        linkedSysOperLogSysDept: {
          deptId:undefined,    // 部门id
          deptName:undefined,    // 部门名称
        },
      }
    };
    //关联sys_dept表选项
    const getSysDeptItemsDeptName = () => {
      emit("getSysDeptItemsDeptName")
    }
    return {
      proxy,
      openDialog,
      closeDialog,
      onCancel,
      menuRef,
      formRef,
      getSysDeptItemsDeptName,
      ...toRefs(state),
    };
  }
})
</script>
<style scoped>
.system-sysOperLog-detail :deep(.el-form-item--large .el-form-item__label){
  font-weight: bolder;
}
.pic-block{
  margin-right: 8px;
}
.file-block{
  width: 100%;
  border: 1px solid var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  margin-bottom: 5px;
  padding: 3px 6px;
}
.ml-2{margin-right: 5px;}
</style>
