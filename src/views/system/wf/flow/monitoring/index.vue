<template>
  <div class="app-container">
    <el-table v-loading="loading" :data="flowList" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="工作流ID" align="center" prop="id" />
      <el-table-column label="工作流类型" align="center" prop="from_table"  />
      <el-table-column label="工作流名称" align="center" prop="flow_name" />
      <el-table-column label="当前状态" align="center" prop="status" :formatter="statusFormat" />
      <el-table-column label="业务办理人" align="center" prop="user"  />
      <el-table-column label="业务执行时间" align="center" prop="dateline" >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.dateline) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-remove"
              @click="handleStop(scope.row)"
            >终止</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-user"
              @click="handleCheck(scope.row)"
            >代审</el-button>
        </template>
      </el-table-column>
    </el-table>
    <checkFlow ref="ckFlow" @getList="getList"></checkFlow>
  </div>
</template>
<script>
import { monitoring,stopFlow} from '@/api/system/flow/flow'
import checkFlow from "@/components/gflow/checkFlow";
import {delWfNews} from "@/api/system/flow/news";

export default {
  name: "flow",
  components:{checkFlow},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 工作流表格数据
      flowList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询工作流列表 */
    getList() {
      this.loading = true;
      monitoring(this.queryParams).then(response => {
        this.flowList = response.data;
        this.loading = false;
      });
    },

    // $comment字典翻译
    statusFormat(row, column) {
      if(row.status==0){
        return '未审核'
      }else{
        return '已审核'
      }
    },

    handleStop(row){
      this.$confirm('是否要终止此流程【此操作不可恢复】?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return stopFlow({id:row.id,WfStatusField:row.from_status})
      }).then(() => {
        this.getList();
        this.msgSuccess("终止成功");
      }).catch(function() {});
    },
    handleCheck(row){
      row.action_btn = {api:'wfCheck',title:"待审",type:'link',wf_fid:row.from_id,wf_title:row.from_title,wf_type:row.from_table,wf_status_field:row.from_status,sup:'1'}
      this.$refs.ckFlow.handleStartFlow(row)
    },

  } //methods结束
};
</script>
