<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="评论昵称" prop="commentNickname">
        <el-input
          v-model="queryParams.commentNickname"
          placeholder="请输入昵称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="日志标题" prop="logTitle">
        <el-input
          v-model="queryParams.logTitle"
          placeholder="请输入日志标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="评论编号" align="center" prop="comment_id"/>
      <el-table-column label="日志标题" align="center" prop="log_title"/>
      <el-table-column label="昵称" align="center" prop="comment_nickname"/>
      <el-table-column label="评论回复数" align="center" prop="comment_num"/>
      <el-table-column label="创建时间" align="center" prop="create_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.create_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="comment_status" :formatter="statusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="是否审核" prop="commentStatus">
          <el-radio-group v-model="form.commentStatus">
            <el-radio :label="0">未审核</el-radio>
            <el-radio :label="1">审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评论内容" prop="commentContent">
          <el-input v-model="form.commentContent" type="textarea" autosize placeholder="请输入内容"/>
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
import {listInfo, getInfo, delInfo , updateInfo,} from "@/api/plugin/blog/comment";
import {getToken} from "@/utils/auth";

export default {
  data() {
    return {
      //上传加载
      upLoading: false,
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
      // 菜单树选项
      menuOptions: [],
      // 表格数据
      infoList: [],
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
        commentNickname: undefined,
        logTitle: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        commentStatus: [{required: true, message: "审核不能为空", trigger: "blur"}],
        commentContent: [{required: true, message: "内容不能为空", trigger: "blur"},],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data.values || [];
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.data.list;
        this.total = response.data.total;
        // this.pageNum = response.data.currentPage;
        this.loading = false;
      });
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
      } else {
        this.msgError(res.msg);
      }
      this.upLoading = false;
    },

    beforeAvatarUpload(file) {
      this.upLoading = true;
      return true;
    },

    setUpData() {
      return {token: getToken()};
    },

    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.comment_status);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        commentStatus: "",
        commentContent: "",
      };
      this.resetForm("form");
      this.imageUrl = "";
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
      this.ids = selection.map((item) => item.comment_id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const commentId = row.comment_id || this.ids;
      getInfo(commentId).then((response) => {
        let data = response.data;
        if (data) {
          this.form = {
            commentId: data.comment_id,
            commentContent: data.comment_content,
            commentStatus: data.comment_status,
          };
        }
        this.open = true;
        this.title = "修改";

      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
            updateInfo(this.form).then((response) => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const commentIds = row.comment_id ? [row.comment_id] : this.ids;
      this.$confirm(
        '是否确认删除编号为"' + commentIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInfo(commentIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {
        });
    },
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  }

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
  }

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  }

.avatar {
  width: 178px;
  height: 178px;
  display: block;
  }
</style>
