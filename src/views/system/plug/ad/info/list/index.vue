<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="广告名称" prop="adName">
        <el-input
          v-model="queryParams.adName"
          placeholder="请输入广告名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <!-- <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="岗位状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>-->
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
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-sort"
          size="mini"
          @click="handleSort"
        >排序
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col>-->
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="广告编号" align="center" prop="ad_id"/>
      <el-table-column label="广告名称" align="center" prop="ad_name"/>
      <el-table-column label="所属位置" align="center" prop="adtype_name"/>
      <el-table-column label="创建时间" align="center" prop="ad_addtime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ad_addtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ad_sort"
        label="排序"
        width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.ad_sort" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="ad_open" :formatter="statusFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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

    <!-- 添加或修改广告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属位置" prop="adAdtypeid">
          <el-select v-model="form.adAdtypeid" placeholder="请选择">
            <el-option
              v-for="(item,index) in menuOptions"
              :label="item.adtype_name"
              :key="index.adtype_id"
              :value="item.adtype_id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告名称" prop="adName">
          <el-input v-model="form.adName" placeholder="请输入广告名称"/>
        </el-form-item>
        <el-form-item label="广告模式" prop="adCheckid">
          <el-radio-group v-model="form.adCheckid" @change="modelSelect">
            <el-radio :label="1">图片模式</el-radio>
            <el-radio :label="2">JS代码</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="flag" label="广告图片" prop="adPic">
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
            <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-if="flag" label="链接URL" prop="adUrl">
          <el-input v-model="form.adUrl" placeholder="请输入链接URL"/>
        </el-form-item>
        <el-form-item v-if="!flag" label="JS代码" prop="adJs">
          <el-input v-model="form.adJs" placeholder="请输入JS代码"/>
        </el-form-item>
        <el-form-item label="是否审核" prop="adOpen">
          <el-radio-group v-model="form.adOpen">
            <el-radio :label="0">未审核</el-radio>
            <el-radio :label="1">审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="adSort">
          <el-input-number v-model="form.adSort" controls-position="right" :min="0"/>
        </el-form-item>
        <el-form-item label="广告内容" prop="adContent">
          <el-input v-model="form.adContent" placeholder="请输入广告内容"/>
        </el-form-item>
        <!-- <el-form-item label="岗位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in statusOptions"
              :key="dict.key"
              :label="dict.key"
            >{{dict.value}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <!-- <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {listInfo, getInfo, delInfo, addInfo, updateInfo, sortMenu} from "@/api/system/ad/info";
import {listNameType} from "@/api/system/ad/type";
import {getToken} from "@/utils/auth";

export default {
  name: "Info",
  data() {
    return {
      //图片上传地址
      imageUrl: "",
      //上传加载
      upLoading: false,
      // 判断标签是否显示
      flag: true,
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
        // postCode: undefined,
        adName: undefined,
        adOpen: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        adAdtypeid: [
          {required: true, message: "所属位置不能为空", trigger: "blur"},
        ],
        adName: [
          {required: true, message: "广告名称不能为空", trigger: "blur"},
        ],
        adCheckid: [
          {required: true, message: "广告模式不能为空", trigger: "blur"},
        ],
        adJs: [{required: true, message: "JS代码不能为空", trigger: "blur"}],
        adSort: [
          {required: true, message: "广告排序不能为空", trigger: "blur"},
        ],
        adOpen: [{required: true, message: "审核不能为空", trigger: "blur"}],
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
    /** 查询广告列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.data.list;
        this.total = response.data.total;
        // this.pageNum = response.data.currentPage;
        this.loading = false;
      });
    },

    // 广告模式选择
    modelSelect(value) {
      if (value != 1) {
        this.flag = false;
      } else {
        this.flag = true;
      }
    },

    // 广告模式选择(用于修改)
    editModelSelect() {
      if (this.form.adCheckid == 1) {
        this.flag = true;
      }
      if (this.form.adCheckid == 2) {
        this.flag = false;
      }
    },

    // 查询广告所属位置列表
    getType() {
      listNameType().then((response) => {
        this.menuOptions = response.data;
        // this.pageNum = response.data.currentPage;
      });
    },

    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.adPic = res.data.fileInfo.fileUrl;
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

    // 广告状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.ad_open);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        plugAdID: undefined,
        adAdtypeid: undefined,
        adName: "",
        adCheckid: undefined,
        adUrl: "",
        adJs: "",
        adPic: "",
        adSort: 0,
        adOpen: "",
        adContent: "",
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
      this.ids = selection.map((item) => item.ad_id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 排序 */
    setSortMap(infoList) {
      let sortMap = {}
      infoList.forEach(item => {
        sortMap[item.ad_id] = item.ad_sort
      })
      return sortMap
    },
    handleSort() {
      let sortMap = this.setSortMap(this.infoList)
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
      this.flag = true;
      this.open = true;
      this.form.adCheckid = 1;
      this.form.adOpen = 0;
      this.title = "添加广告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getType();
      const plugAdID = row.ad_id || this.ids;
      getInfo(plugAdID).then((response) => {
        //this.form = response.data;
        let data = response.data;
        if (data) {
          this.form = {
            plugAdID: data.ad_id,
            adName: data.ad_name,
            adAdtypeid: data.ad_adtypeid,
            adCheckid: data.ad_checkid,
            adJs: data.ad_js,
            adPic: data.ad_pic,
            adUrl: data.ad_url,
            adContent: data.ad_content,
            adSort: data.ad_sort,
            adOpen: data.ad_open,
            // remark: data.remark
          };
          this.imageUrl = this.apiUrl + "/" + data.ad_pic;
        }
        this.editModelSelect();
        this.open = true;
        this.title = "修改广告";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.plugAdID != undefined) {
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
      const plugAdIDs = row.ad_id ? [row.ad_id] : this.ids;
      this.$confirm(
        '是否确认删除广告编号为"' + plugAdIDs + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInfo(plugAdIDs);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {
        });
    },
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
</style>
