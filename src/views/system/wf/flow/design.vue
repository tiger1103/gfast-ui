<template>
  <workFlow v-if="isRouterAlive" :tableFields="tableFields" :processList="processList" :ManagerData="manager" :processStep="processStep"
            @deleteFlowNode="deleteFlowNode"  @getProcessData="getProcessData" @setProcessList="setProcessList"
            @saveProcess="saveProcess" ref="design" @addProcess="addProcess" @getManager="getManager"
            @doSaveAttr="doSaveAttr" @clearAllNodes="clearAllNodes" @checkFlow="checkFlow"></workFlow>
</template>
<script>
import workFlow from '@/components/gflow/workFlow';
import {getProcess,addProcess,saveProcess,getManager,doSaveAttr,deleteFlowNode,clearAllNodes,checkFlow} from '@/api/system/flow/flow'
export default {
  name: 'gFlow',
  components: {
    workFlow
  },
  data(){
    return {
      isRouterAlive:true,
      processList:[],
      total:0,
      flowInfo:{},
      tableFields:[],
      manager:[],
      processStep:[],
    }
  },
  beforeMount() {
      this.getProcessData()
  },
  methods:{
    async getProcessData(){
      const { id } = this.$route.query;
      await getProcess(id).then(response=>{
        this.flowInfo = response.data.flowInfo
        let processList = response.data.processList
        let to = processList.some(item=>{
          return item.process_to!=""
        })
        if(!to && processList.length>1){
          processList[0].process_to = ''+processList[1].id
        }
        this.processList = processList
        this.total = response.data.total
        this.tableFields = response.data.fields
        this.processStep = response.data.processStep
      })
      this.$refs['design'].clearJsPlumb()
      this.$refs['design'].reDraw()
    },
    setProcessList(data){
      this.processList = data
    },
    //添加步骤
    addProcess(){
      addProcess(this.flowInfo.id).then(response=>{
        if (response.code === 0) {
          this.msgSuccess(response.msg)
          this.reload()
        }
      })
    },
    //保存设计
    saveProcess(data){
      saveProcess(data).then(response=>{
        if(response.code===0){
          this.msgSuccess(response.msg)
          this.$refs['design'].wfRefresh()
        }
      })
    },
    getManager(data){
      getManager(data).then(response=>{
        if(response.code===0){
          this.manager = response.data?response.data:[]
        }
      })
    },
    //保存右侧属性
    doSaveAttr(data){
      doSaveAttr(data).then(response=>{
        if(response.code===0){
          this.msgSuccess(response.msg)
          this.$refs['design'].wfRefresh()
        }
      })
    },
    deleteFlowNode(data){
      const param = {process_id:data.sourceId,flow_id:this.flowInfo.id}
      deleteFlowNode(param).then(response=>{
        if(response.code===0){
          this.msgSuccess(response.msg)
          this.reload()
        }
      })
    },
    clearAllNodes(){
      clearAllNodes({flow_id:this.flowInfo.id}).then(response=>{
        if(response.code===0){
          this.msgSuccess(response.msg)
          this.reload()
        }
      })
    },
    checkFlow(){
      checkFlow({flow_id:this.flowInfo.id}).then(response=>{
        if(response.code===0){
          this.msgSuccess(response.msg)
        }
      })
    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
        this.$nextTick(()=>{this.$refs['design'].wfRefresh()})
      })
    }
  }
}
</script>
