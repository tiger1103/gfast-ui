<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="分类名称" prop="cName">
        <el-input
          v-model="queryParams.cName"
          placeholder="请输入分类名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="cStatus">
        <el-select v-model="queryParams.cStatus" placeholder="分类状态" clearable size="small">
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
          type="warning"
          icon="el-icon-sort"
          size="mini"
          @click="handleSort"
        >排序</el-button>
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

    <el-table v-loading="loading" :data="listdata" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="分类编号" align="center" prop="c_id" />
      <el-table-column label="分类名称" align="center" prop="c_name" />

      <el-table-column
            prop="c_sort"
            label="排序"
            width="80">
        <template slot-scope="scope">
            <el-input v-model="scope.row.c_sort" size="mini"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" prop="c_status" :formatter="statusFormat" />
      <el-table-column label="创建时间" align="center" prop="create_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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

    <!-- 添加或修改岗位对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="cName">
          <el-input v-model="form.cName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类顺序" prop="cSort">
          <el-input-number v-model="form.cSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="分类状态" prop="cStatus">
          <el-radio-group v-model="form.cStatus">
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
import { listData,addCategory,getCategory,sortCategory,delCategory,updateCategory} from "@/api/system/model/category";

export default {
  name: "Post",
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
      // 岗位表格数据
      listdata: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        cName: undefined,
        cstatus: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cName: [
          { required: true, message: "分类名称不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data.values || [];
    });
  },
  methods: {
    /** 查询分类列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then(response => {
        this.listdata = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 分类状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, ''+row.c_status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        cId: undefined,
        cName: '',
        cSort: 0,
        cStatus: "1",
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
      this.ids = selection.map(item => item.c_id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.c_id || this.ids
      getCategory(id).then(response => {
        //this.form = response.data;
        let data = response.data
        if (data) {
          this.form = {
            cId: data.c_id,
            cName: data.c_name,
            cSort: data.c_sort,
            cStatus: ""+data.c_status,
          };
        }
        this.open = true;
        this.title = "修改分类";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.cId != undefined) {
            updateCategory(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addCategory(this.form).then(response => {
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
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.c_id ? [row.c_id] :  this.ids;
      this.$confirm('是否确认删除分类编号为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delCategory(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有分类数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportPost(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    },
    handleSort(){
        let sortMap = {}
        this.listdata.forEach(item => {
            sortMap[item.c_id] = item.c_sort
         })
        sortCategory(sortMap).then(response => {
          if (response.code === 0) {
            this.msgSuccess("排序成功");
            this.open = false;
            this.getList();
          } else {
            this.msgError(response.msg);
          }
        });
    },
  }
};
</script>
