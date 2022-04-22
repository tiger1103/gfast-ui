<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Gfast 安装向导</span>
      </div>
    </template>
    <Step :number="1"></Step>

    <div class="content">
      <el-row :gutter="20">
        <el-col :span="6"><strong>环境检测</strong></el-col>
        <el-col :span="6"><strong>推荐配置</strong></el-col>
        <el-col :span="6"><strong>当前状态</strong></el-col>
        <el-col :span="6"><strong>最低要求</strong></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">操作系统</el-col>
        <el-col :span="6">类UNIX</el-col>
        <el-col :span="6">{{sysInfo.sysOsName}}</el-col>
        <el-col :span="6">不限制</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">GO版本</el-col>
        <el-col :span="6"> >1.15 </el-col>
        <el-col :span="6">{{sysInfo.goVersion}}</el-col>
        <el-col :span="6">1.15</el-col>
      </el-row>
    </div>

    <div class="foot">
      <el-button @click="again">重新检测</el-button>
      <el-button type="primary" @click="next">下一步</el-button>
    </div>
  </el-card>
</template>

<script lang="ts">
import Step from './step.vue'
import {getEnvInfo as fetchEnvInfo} from '/@/api/system/dbInit'
import {ref,  onMounted, defineComponent, inject} from "vue";
export default defineComponent({
  name: "checkEnv",
  setup(){
    let sysInfo: any = ref({})
    const jump: any = inject('jump')
    const getEnvInfo = async () => {
      fetchEnvInfo().then((res:any) => {
        const {code, data} = res
        if (code === 0) {
          sysInfo.value = data
        }
      })
    }

    onMounted(getEnvInfo)

    return {
      getEnvInfo,
      sysInfo,
      jump
    }

  },
  components:{
    Step
  },
  methods:{
    next() {
      this.jump('Init')
    },
    again() {
      this.getEnvInfo()
    }
  }
})
</script>

<style scoped  lang="scss">
.box-card{
  margin:100px auto;
  width:500px;
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
