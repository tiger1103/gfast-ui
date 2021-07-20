<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="模型标识" prop="modelName">
        <el-input
          v-model="queryParams.modelName"
          placeholder="请输入模型标识"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="模型名称" prop="modelTitle">
        <el-input
          v-model="queryParams.modelTitle"
          placeholder="请输入模型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="modelStatus">
        <el-select v-model="queryParams.modelStatus" placeholder="模型状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="模型分类" prop="modelCategoryId">
        <el-select v-model="queryParams.modelCategoryId" placeholder="模型分类" clearable size="small">
          <el-option
            v-for="dict in categoryList"
            :key="dict.c_id"
            :label="dict.c_name"
            :value="dict.c_id"
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

    <el-table v-loading="loading" :data="list" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模型ID" align="center" prop="model_id" />
      <el-table-column label="模型标识" align="center" prop="model_name" />
      <el-table-column label="模型名称" align="center" prop="model_title" />
      <el-table-column label="模型分类" align="center" prop="c_name" />
      <el-table-column label="数据引擎" align="center" prop="model_engine" />
      <el-table-column label="状态" align="center" >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.model_status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="create_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="280">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-fold"
            @click="handleFieldsList(scope.row)"
          >字段列表</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-copy"
            @click="handleCopyModel(scope.row)"
          >复制模型</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-video-play"
            @click="handleCreateModel(scope.row)"
          >生成模型</el-button>
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

    <!-- 添加或修改模型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="模型分类" prop="modelCategoryId">
          <el-select v-model="form.modelCategoryId">
            <el-option
              v-for="item in categoryList"
              :key="item.c_id"
              :label="item.c_name"
              :value="item.c_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型标识" prop="modelName">
          <el-input v-model="form.modelName" placeholder="请输入模型标识" />
        </el-form-item>
        <el-form-item label="模型名称" prop="modelTitle">
          <el-input v-model="form.modelTitle" placeholder="请输入模型名称" />
        </el-form-item>
        <el-form-item label="引擎类型" prop="modelEngine">
          <el-select v-model="form.modelEngine">
            <el-option
              v-for="item in engineScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模型状态" prop="modelStatus">
          <el-radio-group v-model="form.modelStatus">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.key"
              :label="dict.key"
            >{{dict.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listData,addModel,getModel,updateModel,changeStatus,delModel,createModel,copyModel} from "@/api/system/model/info";
import {getCategoryAll as getCategory} from "@/api/system/model/category";

export default {
  name: "Post",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //模型分类
      categoryList:[],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数l
      total: 0,
      // 岗位表格数据
      list: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 数据范围选项
      engineScopeOptions: [
        {
          value: "MyISAM",
          label: "MyISAM"
        },
        {
          value: "InnoDB",
          label: "InnoDB"
        },
      ],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        modelName: undefined,
        modelTitle: undefined,
        modelStatus: undefined,
        modelCategoryId:undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        modelCategoryId:[
          { required: true, message: "请选择模型分类", trigger: "change" }
        ],
        modelName: [
          { required: true, message: "模型标识不能为空", trigger: "blur" }
        ],
        modelTitle: [
          { required: true, message: "模型名称不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data.values || [];
    });
    getCategory().then(response => {
      this.categoryList  = response.data || [];
    });
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      this.list = [];
      listData(this.queryParams).then(response => {
        if(response.data.list){
          response.data.list.map(item=>{
            item.model_status = ''+item.model_status
            this.list.push(item)
          })
        }
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 岗位状态字典翻译
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
        modelId: undefined,
        modelCategoryId:undefined,
        modelName: undefined,
        modelTitle: undefined,        
        modelEngine:"MyISAM",
        modelStatus: "1",
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
      this.ids = selection.map(item => item.model_id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加模型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const postId = row.model_id || this.ids
      getModel(postId).then(response => {
        let data = response.data
        if (data) {
          this.form = {
            modelId: data.model_id,
            modelCategoryId:data.model_category_id,
            modelName: data.model_name,
            modelTitle: data.model_title,        
            modelEngine:data.model_engine,
            modelStatus: ""+data.model_status,
          }
        }
        
        this.open = true;
        this.title = "修改模型";
      });
    },
    handleFieldsList(row){
        const modelId = row.model_id || this.ids[0];
        this.$router.push({ path: "/modelInfo/fields", query: { modelId: modelId } });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.modelId != undefined) {
            updateModel(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addModel(this.form).then(response => {
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
    //复制模型
    handleCopyModel(row){
        copyModel(row.model_id).then(response=>{
          this.msgSuccess("模型复制成功");
          this.loading = true;
          this.getList();
        }).catch((rej)=>{
          
        })
    },
    //生成模型数据
    handleCreateModel(row){
      this.$confirm('将重建数据库，原有数据自动备份，确认生成？', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return createModel(row.model_id);
        }).then(() => {
          this.msgSuccess("模型生成成功");
        }).catch(function(response) {
          this.msgError(response.msg);
        });
    },
    //状态修改
    handleStatusChange(row) {
      let text = row.model_status === "1" ? "启用" : "停用";
      this.$confirm('确认要"' + text + '"' + row.model_title + '"吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changeStatus(row.model_id, row.model_status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.model_status = row.model_status === "0" ? "1" : "0";
        });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.model_id ? [row.model_id] :  this.ids;
      this.$confirm('是否确认删除编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delModel(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有岗位数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPost(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>