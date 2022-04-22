<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Gfast 安装向导</span>
      </div>
    </template>
    <Step :number="2"></Step>

    <div class="content">
      <el-form
          ref="ruleFormRef"
          status-icon
          label-width="120px"
          :model="ruleForm"
          :rules="rules"
      >
        <el-divider> 数据库配置 </el-divider>
        <el-form-item label="数据库地址" prop="dbHost">
          <el-input v-model="ruleForm.dbHost" placeholder="例如:127.0.0.1"/>
        </el-form-item>

        <el-form-item label="数据库端口" prop="dbPort">
          <el-input v-model.number="ruleForm.dbPort" placeholder="例如:3306"/>
        </el-form-item>

        <el-form-item label="数据库用户名" prop="dbUser">
          <el-input v-model="ruleForm.dbUser" placeholder="请输入数据库用户名"/>
        </el-form-item>

        <el-form-item label="数据库密码" prop="dbPass">
          <el-input  v-model="ruleForm.dbPass" placeholder="请输入数据库密码"/>
        </el-form-item>

        <el-form-item label="数据库名称" prop="dbName">
          <el-input v-model="ruleForm.dbName" placeholder="请输入数据库名称"/>
        </el-form-item>

        <el-form-item label="数据库编码" prop="dbCharset">
          <el-autocomplete  :fetch-suggestions="querySearch" v-model="ruleForm.dbCharset" placeholder="请输入数据库编码"/>

        </el-form-item>

        <el-divider> Redis配置 </el-divider>

        <el-form-item label="Redis地址" prop="redisAddress">
          <el-input  v-model="ruleForm.redisAddress" placeholder="例如:127.0.0.1"/>
        </el-form-item>

        <el-form-item label="Redis端口" prop="redisPort">
          <el-input  v-model.number="ruleForm.redisPort" placeholder="例如:6379"/>
        </el-form-item>

        <el-form-item label="Redis索引" prop="redisDb">
          <el-input v-model.number="ruleForm.redisDb" placeholder="请输入Redis索引"/>
        </el-form-item>

        <el-form-item label="Redis密码" prop="redisPass">
          <el-input v-model="ruleForm.redisPass" placeholder="请输入Redis密码"/>
        </el-form-item>

      </el-form>
    </div>

    <div class="foot">
      <el-button type="primary" @click="jump('CheckEnv')">上一步</el-button>
      <el-button type="primary" @click="next(ruleFormRef)">创建数据</el-button>
    </div>
  </el-card>
</template>


<script lang="ts" setup>
import {createDb} from "/@/api/system/dbInit/index"

import { reactive, ref, inject } from 'vue'

const jump:any = inject('jump')

import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElLoading } from 'element-plus'
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
  dbHost: '127.0.0.1',
  dbPort: 3306,
  dbUser: 'root',
  dbPass:'root',
  dbName:'',
  dbCharset:'utf8mb4',
  redisAddress:'127.0.0.1',
  redisPort:6379,
  redisDb:1,
  redisPass:'',
})
const rules = reactive<FormRules>({
  dbHost: [{ required: true, message: '请输入数据库地址', trigger: 'blur' }],
  dbPort: [{ required: true, message: '请输入数据库端口', trigger: 'blur' },{ type: 'number', message: '数据库端口必须是一个数值' }],
  dbUser: [{ required: true, message: '请输入数据库用户名', trigger: 'blur' }],
  dbName: [{ required: true, message: '请输入数据库名称', trigger: 'blur' }],
  dbCharset: [{ required: true, message: '请输入数据库编码' }],
  redisAddress: [{ required: true, message: '请输入Redis地址', trigger: 'blur' }],
  redisPort: [{ required: true, message: '请输入Redis端口', trigger: 'blur' },{ type: 'number', message: 'Redis端口必须是一个数值' }],
  redisDb: [{ required: true, message: '请输入Redis索引', trigger: 'blur' },{ type: 'number', message: 'Redis索引必须是一个数值' }],
})

interface DbCharsetItem {
  value: string
}

const dbCharsetList = ref<DbCharsetItem[]>([
  {value:'utf8mb4'},
  {value:'utf8'},
  {value:'gbk'},
  {value:'gb2312'}
])

const querySearch = (query: string, cb: any) => {
  const results = query ? dbCharsetList.value.filter((item:DbCharsetItem) => item.value.indexOf(query) >= 0) : dbCharsetList.value
  cb(results)
}

const next = async (formEl: FormInstance | undefined) => {

  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      let res:any = await createDb(ruleForm)
      loading.close()
      const {code, message, data} = res
      if (code === 0 && data === true) {
        ElMessage({
          showClose: true,
          message: '初始化成功',
          type: 'success',
        })
        jump('Finish')
      } else {
        ElMessage({
          showClose: true,
          message: message || '初始化操作失败!',
          type: 'error',
        })
      }


    }
  })

}


</script>

<script lang="ts">
import Step from './step.vue'
import { defineComponent} from "vue";

export default defineComponent({
  name: "init",
  components:{
    Step
  },


  methods:{

  }
})
</script>

<style scoped  lang="scss">
.box-card{
  margin:100px auto;
  width:600px;
  min-height:550px;
  .content {
    height:370px;
    margin-bottom:10px;
    padding:10px;
    overflow: auto;
    .el-row {
      margin-bottom: 10px;
    }
  }
  .foot {
    text-align:center;
  }
}
</style>
