<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
          v-model="queryParams.jobName"
          placeholder="请输入任务名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select v-model="queryParams.jobGroup" placeholder="请选择任务组名" clearable size="small">
          <el-option
            v-for="dict in jobGroupOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择任务状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
    </el-row>

    <el-table v-loading="loading" :data="jobList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="任务名称" align="center" prop="job_name" :show-overflow-tooltip="true" />
      <el-table-column label="任务分组" align="center" prop="job_group" :show-overflow-tooltip="true" />
      <el-table-column
        label="任务方法名"
        align="center"
        prop="invoke_target"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="cron执行表达式"
        align="center"
        prop="cron_expression"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
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

    <!-- 添加或修改定时任务对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务名称" prop="job_name">
              <el-input v-model="form.job_name" placeholder="请输入任务名称" />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="任务分组" prop="job_group">
              <el-select v-model="form.job_group" placeholder="请选择">
                <el-option
                  v-for="dict in jobGroupOptions"
                  :key="dict.key"
                  :label="dict.value"
                  :value="dict.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="invoke_target">
              <span slot="label">
                调用方法
                <el-tooltip placement="top">
                  <div slot="content">
                    示例：demo1
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.invoke_target" placeholder="请输入调用方法字符串" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item prop="job_params">
              <span slot="label">
                执行参数
                <el-tooltip placement="top">
                  <div slot="content">
                    以|分隔多个参数 示例：param1|param1
                    <br />参数说明：支持字符串，布尔类型，长整型，浮点型，整型
                  </div>
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </span>
              <el-input v-model="form.job_params" placeholder="若有参数，请输入。" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="cron表达式" prop="cron_expression">
              <el-input v-model="form.cron_expression" placeholder="请输入cron执行表达式" />
              <ul style="list-style: none;">
                  <li><i class="el-icon-warning"></i> */5 * * * * ? : 每隔5秒执行一次</li>
                  <li><i class="el-icon-warning"></i> 20 */1 * * * ? : 每隔1分钟执行一次</li>
                  <li><i class="el-icon-warning"></i> 30 0 23 * * ? : 每天23点执行一次</li>
                  <li><i class="el-icon-warning"></i> 0 0 1 * * ? : 每天凌晨1点执行一次</li>
                  <li><i class="el-icon-warning"></i> 0 0 1 1 * ? : 每月1号凌晨1点执行一次</li>
              </ul>
            </el-form-item>
          </el-col>



          <el-col :span="24">
            <el-form-item label="执行策略">

              <el-radio-group v-model="form.misfire_policy">
        
                <el-radio :label="1">重复执行</el-radio>
                <el-radio :label="2">执行一次</el-radio>
              </el-radio-group>
              
            </el-form-item>
          </el-col>


          <el-col :span="24">
            <el-form-item label="状态">

              <el-radio-group v-model="form.status">

                    
                  <el-radio
                    v-for="dict in statusOptions"    
                    :key="dict.key"
                    :label="dict.key">{{dict.value}}</el-radio>
          

              </el-radio-group>
              
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import {
  listJob,
  getJob,
  delJob,
  addJob,
  updateJob,
  exportJob,
  runJob,
  changeJobStatus,
  start,
  stop,
} from "@/api/monitor/job";

export default {
  name: "Job",
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
      // 总条数
      total: 0,
      // 定时任务表格数据
      jobList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示详细弹出层
      openView: false,
      // 任务组名字典
      jobGroupOptions: [],
      // 状态字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        jobName: [
          { required: true, message: "任务名称不能为空", trigger: "blur" }
        ],
        invokeTarget: [
          { required: true, message: "调用目标字符串不能为空", trigger: "blur" }
        ],
        cronExpression: [
          { required: true, message: "cron执行表达式不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
 
    // this.getDicts("sys_normal_disable").then(response => {
    //   this.statusOptions = response.data.values || []
    // });

    this.statusOptions = [
      {"key": 0,"value": "正常"},
      {"key": 1,"value": "停用"}
    ]
  },
  methods: {
    /** 查询定时任务列表 */
    getList() {
      this.loading = true;
      listJob(this.queryParams).then(response => {
        this.jobList = response.data.list;
        this.total = response.data.total;
        this.loading = false;

        this.jobGroupOptions = response.data.searchGroup.values;

      });
    },
    // 任务组名字典翻译
    jobGroupFormat(row, column) {
      return this.selectDictLabel(this.jobGroupOptions, row.jobGroup);
    },
    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        job_id: undefined,
        job_name: undefined,
        job_params:undefined,
        job_group: undefined,
        invoke_target: undefined,
        cron_expression: undefined,
        misfire_policy: 1,
        concurrent: 1,
        status: 0
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
      this.ids = selection.map(item => item.jobId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 任务状态修改
    handleStatusChange(row) {
      console.log(row.status)
      let text = row.status === 0 ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.job_name + '"任务吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(function() {
         
        if(row.status === 0){
          return start(row.job_id);
        } else {
          return stop(row.job_id);
        }

      }).then(() => {
        this.msgSuccess(text + "成功");
      }).catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });

    },

    /** 任务日志列表查询 */
    handleJobLog() {
      this.$router.push("/job/log");
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加任务";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const jobId = row.job_id || 0;
      getJob(jobId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改任务";
      });
    },

    /** 删除按钮操作 */
    handleDelete(row) {
      const jobIds = row.job_id || 0;
      this.$confirm(
        '是否确认删除该数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(function() {
          return delJob(jobIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function() {});
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.job_id != undefined) {
            updateJob(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addJob(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },

    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有定时任务数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return exportJob(queryParams);
        })
        .then(response => {
          this.download(response.msg);
        })
        .catch(function() {});
    }
  }
};
</script>