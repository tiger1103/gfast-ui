<template>
  <div class="check-flow-container">
    <!--发起工作流-->
    <el-dialog title="发起工作流" :visible.sync="startWfOpen" width="500px" append-to-body>
      <el-form ref="wfStartForm" :model="wfStartForm" :rules="wfStartRules" label-width="120px">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="startWfTitle" disabled />
        </el-form-item>
        <el-form-item label="选择工作流" prop="wfId">
          <el-select v-model="wfStartForm.wfId" >
            <el-option
              v-for="item in wfOptions"
              :key="item.id"
              :label="item.flow_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="紧急程度" prop="newType">
          <el-select v-model="wfStartForm.newType" >
            <el-option
              v-for="item in levelOptions"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核意见" prop="checkCon">
          <el-input v-model="wfStartForm.checkCon" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitWfStart">确 定</el-button>
        <el-button @click="cancelWfStart">取 消</el-button>
      </div>
    </el-dialog>
    <!--流程审批-->
    <el-dialog title="流程审批" :visible.sync="checkWfOpen" width="900px" append-to-body>
      <el-form ref="wfCheckForm" :model="wfCheckForm" :rules="wfCheckRules" label-width="120px">
        <el-form-item label="项目名称" prop="title">
          <el-input v-model="checkWfTitle" disabled />
        </el-form-item>
        <el-form-item :label="(checkFlowInfo&&checkFlowInfo.sing_st==0?'审批':'会签')+'意见'" prop="checkCon">
          <el-input v-model="wfCheckForm.checkCon"  type="textarea" :rows="3"/>
        </el-form-item>
        <el-form-item label="下一步骤" prop="nextStep" v-show="nextProcess&&!back_process">
          <el-tag v-if="checkFlowInfo&&checkFlowInfo.wf_mode == 2">[同步]</el-tag>
          <template v-if="checkFlowInfo&&checkFlowInfo.status.wf_mode != 2">
            <el-tag v-if="checkFlowInfo&&checkFlowInfo.next_process[0].auto_person != 3">{{checkFlowInfo['next_process'][0]['process_name']}}({{checkFlowInfo['next_process'][0]['todo']['text'] instanceof Array ? checkFlowInfo['next_process'][0]['todo']['text'].join(','):checkFlowInfo['next_process'][0]['todo']['text']}})</el-tag>
            <el-select v-else placeholder="指定办理人员" v-model="wfCheckForm.todo">
              <template v-if="checkFlowInfo">
                <el-option
                  v-for="(todo,key) of checkFlowInfo.next_process[0].todo.ids"
                  :key="todo"
                  :label="checkFlowInfo['next_process'][0]['todo']['text'][key]"
                  :value="todo+'*%*'+checkFlowInfo['next_process'][0]['todo']['text'][key]"
                >
                </el-option>
              </template>
            </el-select>
          </template>
          <template v-else>
            <template v-if="checkFlowInfo">
              <!--同步模式-->
              <el-tag  v-for="(v,vk) of checkFlowInfo.next_process" :key="vk">{{v.process_name}}({{v.todo}})</el-tag>
            </template>
          </template>
        </el-form-item>
        <el-form-item label="回退步骤" v-if="back_process">
          <el-select placeholder="请选择回退步骤" v-model="wfCheckForm.wfBackFlow" @change="findBTodo()">
            <template v-if="checkFlowInfo">
              <el-option v-for="(back,key) of checkFlowInfo.preprocess"
                         :key="key"
                         :label="back"
                         :value="key"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="会签人员" v-if="sing_process">
          <el-select filterable reserve-keyword remote v-model="wfCheckForm.wfSingFlow"
                     :remote-method="getSelectSingerData"  :loading="selLoading"placeholder="输入姓名选择会签人员" clearable size="small">
            <el-option
              v-for="item of singerData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="附件">
          <up-file :action="apiUrl+'/system/upload/upFile'" @setUpFielList="upFile" :value="[]"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <template v-if="checkFlowInfo">
          <template v-if="checkFlowInfo.sing_st==0">
            <el-button v-show="doCheck && !doBack" type="primary" @click="submitWfCheck('ok')">提交审批</el-button>
            <el-button type="danger" v-if="checkFlowInfo.process.is_back!=2&&!sing_process" @click="submitWfCheck('back')">回  退</el-button>
            <el-button type="success" v-if="checkFlowInfo.process.is_sing!=2 && !doBack" @click="submitWfCheck('sing')">会  签</el-button>
          </template>
          <template v-else>
            <el-button type="primary" v-show="!doSSing&&!SSingBack"  @click="submitSing('sok')">会签提交</el-button>
            <el-button type="danger" v-show="!doSSing||SSingBack"  @click="submitSing('sback')">会签回退</el-button>
            <el-button type="success" v-show="!SSingBack"  @click="submitSing('ssing')">再会签</el-button>
          </template>
        </template>
      </div>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>审批记录</span>
        </div>
        <el-table :data="checkFlowLogs">
          <el-table-column label="审批人" align="center" prop="user" />
          <el-table-column label="审批意见" align="center" prop="content" />
          <el-table-column label="审批操作" align="center" prop="btn" />
          <el-table-column label="审批时间" align="center" prop="dateline" >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.dateline) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="附件" align="center" prop="art" >
            <template slot-scope="scope">
              <el-link v-if="scope.row.art!='' " type="primary" :href="getDownloadUrl(scope.row.art)" target="_blank">下载</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
import {wfStart,saveStartWf,wfCheck,saveCheckWf,getManager,backTodo} from "@/api/system/flow/flow";
import upFile from "@/components/upfile";
export default {
  name: "checkFlow",
  components:{upFile},
  data(){
    return {
      // 流程审批测试表格数据
      wfNewsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openView:false,
      // $comment字典
      statusOptions: [],
      //审批紧急状态
      levelOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        status: [
          { required: true, message: "状态不能为空", trigger: "blur" }
        ]
      },
      startWfTitle:'',
      startWfOpen:false,
      wfOptions:[],
      wfInfo:{},
      wfStartForm:{},
      wfStartRules:{
        wfId: [
          { required: true, message: "请选择工作流", trigger: "change" }
        ],
        newType: [
          { required: true, message: "请选择紧急程度", trigger: "change" }
        ],
      },
      doBack:false,//回退标记
      doCheck:true,
      doSSing:false,//再会签标记
      SSingBack:false,//会签回退
      nextProcess:true,
      checkWfOpen:false,
      wfCheckForm:{},
      wfCheckRules:{},
      checkWfTitle:"",
      checkInfo:{},
      checkFlowInfo:null,
      checkFlowLogs:[],
      back_process:false,
      sing_process:false,
      selLoading:false,
      singerData:[],//提供选择的会签人员数据
      //查看审批信息
      viewFlowLogs:[],
      viewInfo:[],
    }
  },
  created() {
    this.getDicts("flow_level").then(response => {
      this.levelOptions = response.data.values || [];
    });
  },
  methods:{
    getList(){
        this.$emit("getList")
    },
    handleStartFlow(row){
      const btn = row.action_btn
      switch(btn.type){
        case 'link':
          //获取数据
          if(btn.api=='wfStart'){
            this.resetWfForm()
            wfStart({wf_type:btn.wf_type,wf_title:btn.wf_title,wf_status_field:btn.wf_status_field,wf_fid:btn.wf_fid}).then(response=>{
              this.wfOptions = response.data.flow?response.data.flow:[]
              this.wfInfo = response.data.info
              this.wfStartForm.wfType = this.wfInfo.wf_type
              this.wfStartForm.wfTitle = this.wfInfo.wf_title
              this.wfStartForm.wfStatusField = this.wfInfo.wf_status_field
              this.wfStartForm.wfFid = this.wfInfo.wf_fid
              this.startWfTitle = row[this.wfInfo.wf_title]
              this.startWfOpen = true
            })
          }else if(btn.api=='wfCheck'){
            this.resetCheckForm()
            wfCheck({wf_type:btn.wf_type,wf_title:btn.wf_title,wf_status_field:btn.wf_status_field,wf_fid:btn.wf_fid}).then(response=>{
              this.checkFlowInfo = response.data.flowInfo
              this.checkInfo = response.data.info
              this.checkFlowLogs = response.data.flowLogs?response.data.flowLogs:[]
              this.checkWfTitle = response.data.table[btn.wf_title]
              this.wfCheckForm.sup = btn.sup?btn.sup:'0'
              this.wfCheckForm.wfTitle = btn.wf_title
              this.wfCheckForm.wfFid = btn.wf_fid
              this.wfCheckForm.wfType = btn.wf_type
              this.wfCheckForm.wfStatusField = btn.wf_status_field
              this.wfCheckForm.flowId = this.checkFlowInfo.flow_id
              this.wfCheckForm.flowProcess = this.checkFlowInfo.flow_process
              this.wfCheckForm.runId = this.checkFlowInfo.run_id
              this.wfCheckForm.runProcess = this.checkFlowInfo.run_process
              if(this.checkFlowInfo.status.wf_mode!=2){
                this.wfCheckForm.npid = this.checkFlowInfo.next_process[0].id
              }else{
                this.wfCheckForm.npid = this.checkFlowInfo.process.process_to
              }
              this.wfCheckForm.wfMode = this.checkFlowInfo.wf_model
              this.wfCheckForm.singSt = this.checkFlowInfo.sing_st

              this.checkWfOpen = true
            })
          }
          break
      }
    },
    submitWfStart(){
      this.$refs["wfStartForm"].validate(valid => {
        if (valid) {
          saveStartWf(this.wfStartForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("发起成功");
              this.startWfOpen = false;
              this.getList();
            }
          })
        }
      })
    },
    //搜索会签人员
    getSelectSingerData(keywords){
      if(keywords!=''){
        this.selLoading=true
        getManager({type:'getUser',key:keywords}).then(response=>{
          if(response.code===0){
            this.selLoading=false
            this.singerData = response.data?response.data:[]
          }
        }).catch(()=>{
          this.selLoading=false
        })
      }else{
        this.singerData = []
      }
    },
    //获取回退btodo
    findBTodo(){
      backTodo({backId:this.wfCheckForm.wfBackFlow,runId:this.wfCheckForm.runId}).then(response=>{
        this.wfCheckForm.bTodo = response.data
      })
    },
    submitWfCheck(type){
      this.wfCheckForm.submitToSave = type
      switch(type){
        case 'ok':
          saveCheckWf(this.wfCheckForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("审批成功")
              this.checkWfOpen = false
              this.getList()
            }
          })
          break
        case 'sing':
          this.doCheck=false
          this.nextProcess = false
          this.sing_process = true
          if(!this.wfCheckForm.wfSingFlow){
            this.msgError('请选择会签人')
            return
          }
          saveCheckWf(this.wfCheckForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("会签成功")
              this.checkWfOpen = false
              this.getList()
            }
          })
          break
        case 'back':
          this.doBack = true
          this.back_process=true
          if(!this.wfCheckForm.wfBackFlow){
            this.msgError('请选择回退步骤')
            return
          }
          saveCheckWf(this.wfCheckForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("会签回退成功")
              this.checkWfOpen = false
              this.getList()
            }
          })
          break
      }
    },
    submitSing(type){
      this.wfCheckForm.submitToSave = type
      switch (type){
        case 'ssing'://再会签
          this.doSSing = true
          this.SSingBack = false
          this.doCheck=false
          this.nextProcess = false
          this.sing_process = true
          if(!this.wfCheckForm.wfSingFlow){
            this.msgError('请选择会签人')
            return
          }
          saveCheckWf(this.wfCheckForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("会签成功")
              this.checkWfOpen = false
              this.getList()
            }
          })
          break
        case 'sback'://会签回退
          this.SSingBack = true
          this.doSSing = false
          this.doCheck=false
          this.nextProcess = false
          this.sing_process = false
          this.back_process = true
          if(!this.wfCheckForm.wfBackFlow){
            this.msgError('请选择回退步骤')
            return
          }
          saveCheckWf(this.wfCheckForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("会签回退成功")
              this.checkWfOpen = false
              this.getList()
            }
          })
          break
        case 'sok':
          saveCheckWf(this.wfCheckForm).then(response=>{
            if (response.code === 0) {
              this.msgSuccess("会签提交成功")
              this.checkWfOpen = false
              this.getList()
            }
          })
          break
      }
    },
    cancelWfStart(){
      this.startWfOpen = false;
      this.resetWfForm();
    },
    resetWfForm(){
      this.wfOptions = []
      this.wfInfo = {}
      this.startWfTitle = ''
      this.wfStartForm = {
        wfType:'',
        wfTitle:'',
        wfStatusField:'',
        wfFid:'',
        wfId:undefined,
        newType:undefined,
        checkCon:'',
      };
      this.resetForm("wfStartForm");
    },
    resetCheckForm(){
      this.checkWfTitle = ''
      this.wfCheckForm = {
        wfTitle:undefined,
        wfFid:undefined,
        wfType:undefined,
        wfStatusField:undefined,
        flowId:undefined,
        flowProcess:undefined,
        runId:undefined,
        runProcess:undefined,
        npid:undefined,
        wfMode:undefined,
        sup:undefined,
        checkCon:undefined,
        wfBackFlow:undefined,
        art:undefined,
        singSt:undefined,
        submitToSave:undefined,
        wfSingFlow:undefined,//选择的会签人员
        todo:"",
        btodo:"",
      };
      this.doBack = false
      this.doSSing = false
      this.SSingBack = false
      this.doCheck=true
      this.nextProcess = true
      this.sing_process = false
      this.back_process = false
      this.resetForm("wfCheckForm");
    },

    upFile(data){
      if(data&&data.length>0) {
        this.wfCheckForm.art = JSON.stringify(data)
      }else{
        this.wfCheckForm.art = ""
      }
    },
    getDownloadUrl(row){
      const json = JSON.parse(row)
      return this.apiUrl+"/"+json[0].url
    }
  }
}
</script>

<style scoped>

</style>
