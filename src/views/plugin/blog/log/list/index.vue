<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
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
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
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

    <el-table v-loading="loading" :data="menuList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" align="center" prop="log_id" />
      <el-table-column label="标题" align="center" prop="log_title" />
      <el-table-column label="作者" align="center" prop="log_author" />
      <el-table-column label="所属分类" align="center" prop="classification_name" />
      <el-table-column label="标志" align="center" prop="log_sign" :formatter="signFormat" />
      <el-table-column label="创建时间" align="center" prop="creat_time">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.creat_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="log_sort"
        label="排序"
        width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.log_sort" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="log_status" :formatter="statusFormat" />
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

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="950px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属分类" prop="logType">
          <el-select v-model="form.logType" placeholder="请选择">
            <el-option
              v-for="(item,index) in menuOptions"
              :label="item.classification_name"
              :key="index.classification_id"
              :value="item.classification_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日志标题" prop="logTitle">
          <el-input v-model="form.logTitle" placeholder="请输入日志标题" />
        </el-form-item>
        <el-form-item label="作者" prop="logAuthor">
          <el-input v-model="form.logAuthor" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="缩略图" prop="logThumbnail">
          <el-upload
            v-loading="upLoading"
            class="avatar-uploader"
            :action="apiUrl+'/system/upload/upImg'"
            :show-file-list="false"
            name="file"
            :data="setUpData()"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="链接URL" prop="logUrl">
          <el-input v-model="form.logUrl" placeholder="请输入链接URL" />
        </el-form-item>
        <el-form-item label="标志" prop="logSign">
          <el-radio-group v-model="form.logSign">
            <el-radio :label="0">一般</el-radio>
            <el-radio :label="1">置顶</el-radio>
            <el-radio :label="2">幻灯</el-radio>
            <el-radio :label="3">推荐</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="logStatus">
          <el-radio-group v-model="form.logStatus">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="logSort">
          <el-input-number v-model="form.logSort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="内容" class="cate-content">
          <Editor v-model="form.logContent" @setEditContent="setEditContent" ref="cke"/>
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
import {listInfo, getInfo, addInfo, delInfo, updateInfo, sortMenu} from "@/api/plugin/blog/log";
import {listNameInfo} from "@/api/plugin/blog/classification";
import {getToken} from "@/utils/auth";
import Editor from '@/components/CKeditor';

export default {
  name: "Info",
  components: {Editor},
  data() {
    return {
      //图片上传地址
      imageUrl: "",
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
      // 广告表格数据
      menuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 日志标志数据字典
      signOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // postCode: undefined,
        logTitle: undefined,
        logStatus: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        logType: [
          { required: true, message: "所属位置不能为空", trigger: "blur" },
        ],
        logTitle: [
          { required: true, message: "日志标题不能为空", trigger: "blur" },
        ],
        logAuthor: [
          { required: true, message: "作者名不能为空", trigger: "blur" },
        ],
        logSign:[
          { required: true, message: "标志不能为空", trigger: "blur"},
        ],
        logSort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
        ],
        logStatus: [{ required: true, message: "审核不能为空", trigger: "blur" }],
        logContent: [
          { required: true, message: "内容不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data.values || [];
    });
    this.getDicts("sys_log_sign").then((response) => {
      this.signOptions = response.data.values || [];
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.menuList = response.data.list;
        this.total = response.data.total;
        // this.pageNum = response.data.currentPage;
        this.loading = false;
      });
    },

    // 查询所属分类列表
    getType() {
      listNameInfo().then((response) => {
        this.menuOptions = response.data;
        // this.pageNum = response.data.currentPage;
      });
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.logThumbnail = res.data.fileInfo.fileUrl;
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
      return { token: getToken() };
    },

    // /** 转换菜单数据结构 */
    // normalizer(node) {
    //   if (node.children && !node.children.length) {
    //     delete node.children;
    //   }
    //   return {
    //     id: node.id,
    //     label: node.name,
    //     children: node.children
    //   };
    // },

    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.log_status);
    },
    // 日志标志字典翻译
    signFormat(row, column) {
      return this.selectDictLabel(this.signOptions, row.log_sign);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        logId: undefined,
        logType: undefined,
        logTitle: "",
        logAuthor: "",
        logUrl: "",
        logThumbnail: "",
        logSort: 0,
        logStatus: 1,
        logSign: 0,
        logContent: "",
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
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.log_id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 排序 */
    setSortMap(menuList){
      let sortMap = {}
      menuList.forEach(item => {
        sortMap[item.log_id] = item.log_sort
      })
      return sortMap
    },
    handleSort(){
      let sortMap = this.setSortMap(this.menuList)
      sortMenu(sortMap).then(response => {
        if (response.code === 0) {
          this.msgSuccess("排序成功");
          this.open = false;
          this.getList();
        } else {
          this.msgError(response.msg);
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getType();
      this.open = true;
      this.title = "添加日志";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getType();
      const logId = row.log_id || this.ids;
      getInfo(logId).then((response) => {
        //this.form = response.data;
        let data = response.data;
        if (data) {
          this.form = {
            logId: data.log_id,
            logTitle: data.log_title,
            logAuthor: data.log_author,
            logType: data.log_type,
            logThumbnail: data.log_thumbnail,
            logUrl: data.log_url,
            logContent: data.log_content,
            logSort: data.log_sort,
            logStatus: data.log_status,
            logSign: data.log_sign,
          };
          this.imageUrl = this.apiUrl + "/" + data.log_thumbnail;
        }
        this.open = true;
        this.title = "修改日志";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.logId != undefined) {
            updateInfo(this.form).then((response) => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInfo(this.form).then((response) => {
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
      const logIds = row.log_id ? [row.log_id] : this.ids;
      this.$confirm(
        '是否确认删除广告编号为"' + logIds + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInfo(logIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    setEditContent(data){
      this.form.logContent = data
    }
    // /** 导出按钮操作 */
    // handleExport() {
    //   const queryParams = this.queryParams;
    //   this.$confirm('是否确认导出所有岗位数据项?', "警告", {
    //       confirmButtonText: "确定",
    //       cancelButtonText: "取消",
    //       type: "warning"
    //     }).then(function() {
    //       return exportPost(queryParams);
    //     }).then(response => {
    //       this.download(response.msg);
    //     }).catch(function() {});
    // }
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

.cate-content{
  height:600px;
  width: 922px;
}
</style>
