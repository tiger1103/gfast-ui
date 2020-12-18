<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" :data="wfNewsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="id" />
      <el-table-column label="标题" align="center" prop="title" />
      <el-table-column label="发布日期" align="center" prop="up_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.up_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag :type="columnColor(scope.row)">{{statusFormat(scope.row)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="handleView(scope.row)"
          >查看</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            v-if="scope.row.action_btn"
            size="mini"
            type="text"
            icon="el-icon-coordinate"
            @click="handleStartFlow(scope.row)"
          >{{scope.row.action_btn.title}}</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改流程审批测试对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--查看信息-->
    <el-dialog :title="title" :visible.sync="openView" width="900px" append-to-body>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>业务信息</span>
        </div>
        <el-table :data="viewInfo">
          <el-table-column label="新闻标题" align="center" prop="title" />
          <el-table-column label="发布日期" align="center" prop="up_time" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.up_time) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>审批记录</span>
        </div>
        <el-table :data="viewFlowLogs">
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
    <checkFlow ref="ckFlow" @getList="getList"></checkFlow>
  </div>
</template>
<script>
import { listWfNews, getWfNews, delWfNews, addWfNews, updateWfNews,getCheckLog } from '@/api/system/flow/news'
import checkFlow from "@/components/gflow/checkFlow";
export default {
  name: "wfNews",
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
      //查看审批信息
      viewFlowLogs:[],
      viewInfo:[],
    };
  },
  created() {
    this.getList();
    this.getDicts("flow_status").then(response => {
      this.statusOptions = response.data.values || [];
    });
  },
  methods: {
    handleStartFlow(row){
      this.$refs.ckFlow.handleStartFlow(row)
    },
    /** 查询流程审批测试列表 */
    getList() {
      this.loading = true;
      listWfNews(this.queryParams).then(response => {
        this.wfNewsList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // $comment字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    columnColor(row){
      switch (''+row.status){
        case '-1':
          return "danger"
        case '0':
          return "info"
        case '1':
          return "warning"
        case '2':
          return "success"
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        status: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加流程审批测试";
    },
    /**  查看审批信息  */
    handleView(row){
      this.viewInfo = [row]
      getCheckLog({id:row.id,wf_type:"wf_news"}).then(response=>{
        this.viewFlowLogs = response.data?response.data:[]
        this.openView = true
      })
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getWfNews(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改流程审批测试";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateWfNews(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          } else {
            addWfNews(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除流程审批测试编号为"' + ids + '"的数据项?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return delWfNews(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(function() {});
    },
    getDownloadUrl(row){
      const json = JSON.parse(row)
      return this.apiUrl+"/"+json[0].url
    }
  } //methods结束
};
</script>
