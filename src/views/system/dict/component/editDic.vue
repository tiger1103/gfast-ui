<template>
  <div class="system-edit-dic-container">
    <el-dialog title="修改字典" v-model="state.isShowDialog" width="769px">
      <el-form :model="state.ruleForm" ref="formRef" :rules="rules" size="default" label-width="90px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="state.ruleForm.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="state.ruleForm.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="state.ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="state.ruleForm.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel" size="default">取 消</el-button>
          <el-button type="primary" @click="onSubmit(formRef)" size="default">修 改</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="systemEditDic">
import type { FormInstance, FormRules } from 'element-plus'
import { ref, reactive } from 'vue';
import { ElMessage } from "element-plus";
import { getType, editType } from '/@/api/system/dict/type';

interface RuleFormState {
  dictId: number;
  dictName: string;
  dictType: string;
  status: number;
  remark: string;
}

const emit = defineEmits(['typeList'])
const formRef = ref<FormInstance>()
// 定义变量内容
const state = reactive({
  isShowDialog: false,
  ruleForm: {
    dictId: 0,
    dictName: '',
    dictType: '',
    status: 1,
    remark: ''
  },
});

const rules = reactive<FormRules>({
  dictName: [
    { required: true, message: "字典名称不能为空", trigger: "blur" }
  ],
  dictType: [
    { required: true, message: "字典类型不能为空", trigger: "blur" }
  ]
})

// 打开弹窗
const openDialog = (row: RuleFormState) => {
  resetForm();
  if (row) {
    getType(row.dictId).then((res: any) => {
      state.ruleForm = res.data.dictType
    })
    state.ruleForm = row;
  }
  state.isShowDialog = true;
};

const resetForm = () => {
  state.ruleForm = {
    dictId: 0,
    dictName: '',
    dictType: '',
    status: 1,
    remark: ''
  }
};

// 关闭弹窗
const closeDialog = () => {
  state.isShowDialog = false;
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

    //修改
    editType(state.ruleForm).then(() => {
      ElMessage.success('字典类型修改成功');
      closeDialog(); // 关闭弹窗
      emit('typeList')
    })
  })
};

// 暴露变量
defineExpose({
  openDialog,
});
</script>
