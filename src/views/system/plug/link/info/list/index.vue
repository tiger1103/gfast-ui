<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <!-- <el-form-item label="岗位编码" prop="postCode">
        <el-input
          v-model="queryParams.postCode"
          placeholder="请输入岗位编码"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item> -->
      <el-form-item label="链接名称" prop="linkName">
        <el-input
          v-model="queryParams.linkName"
          placeholder="请输入链接名称"
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
      </el-form-item> -->
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
      <!-- <el-col :span="1.5">
        <el-button
          type="warning"
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:post:export']"
        >导出</el-button>
      </el-col> -->
    </el-row>

    <el-table v-loading="loading" :data="infoList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="链接编号" align="center" prop="link_id" />
      <!-- <el-table-column label="岗位编码" align="center" prop="post_code" /> -->
      <el-table-column label="联系人" align="center" prop="link_username" />
      <el-table-column label="链接名称" align="center" prop="link_name" />
      <el-table-column label="链接URL" align="center" prop="link_url" />
      <el-table-column label="联系QQ" align="center" prop="link_qq" />
      <el-table-column label="邮箱" align="center" prop="link_email" />
      <el-table-column label="所属栏目" align="center" prop="linktype_name" />
      <el-table-column label="创建时间" align="center" prop="link_addtime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.link_addtime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="link_order"
        label="排序"
        width="80">
        <template slot-scope="scope">
          <el-input v-model="scope.row.link_order" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="link_open" :formatter="statusFormat" />
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

    <!-- 添加或修改链接对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="所属分类" prop="linkTypeID">
          <el-select v-model="form.linkTypeID" placeholder="请选择">
            <el-option v-for="(item,index) in menuOptions" :label="item.linktype_name" :key="index.linktype_id" :value="item.linktype_id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系人" prop="linkUsername">
          <el-input v-model="form.linkUsername" placeholder="请输入联系人" />
        </el-form-item>
        <el-form-item label="链接名称" prop="linkName">
          <el-input v-model="form.linkName" placeholder="请输入链接名称" />
        </el-form-item>
        <el-form-item label="链接URL" prop="linkUrl">
          <el-input v-model="form.linkUrl" placeholder="请输入链接URL" />
        </el-form-item>
        <el-form-item label="打开方式" prop="linkTarget">
          <el-radio-group v-model="form.linkTarget">
            <el-radio label="_blank">新标签页打开</el-radio>
            <el-radio label="_self">本窗口打开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否审核" prop="linkOpen">
          <el-radio-group v-model="form.linkOpen">
            <el-radio :label="0">未审核</el-radio>
            <el-radio :label="1">审核</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="联系QQ" prop="linkQQ">
          <el-input type="number" v-model="form.linkQQ" placeholder="请输入联系QQ" />
        </el-form-item>
        <el-form-item label="邮箱" prop="linkEmail">
          <el-input v-model="form.linkEmail" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="排序" prop="linkOrder">
          <el-input-number v-model="form.linkOrder" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="备注" prop="linkRemark">
          <el-input v-model="form.linkRemark" type="textarea" autosize placeholder="请输入备注" />
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
import { listInfo, getInfo, delInfo, addInfo, updateInfo, sortMenu} from "@/api/system/link/info";
import { listNameType } from "@/api/system/link/type";

export default {
  name: "Info",
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
      // 菜单树选项
      menuOptions: [],
      // 链接表格数据
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
        linkUrl: undefined,
        linkName: undefined,
        link_open: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        linkUsername: [
          { required: true, message: "联系人不能为空", trigger: "blur"}
        ],
        linkName: [
          { required: true, message: "链接名称不能为空", trigger: "blur" }
        ],
        linkTypeID: [
          {required: true, message: "所属分类不能为空", trigger: "blur"}
        ],
        linkUrl: [
          {required: true, message: "链接URL不能为空", trigger: "blur"}
        ],
        linkTarget: [
          {required: true, message: "打开方式不能为空", trigger: "blur"}
        ],
        linkOpen: [
          {required: true, message: "是否审核不能为空", trigger: "blur"}
        ],
        linkQQ: [
          { required: true, message: "联系QQ不能为空", trigger: "blur" }
        ],
        linkEmail: [
          { required: true, message: "邮箱不能为空", trigger: "blur" }
        ],
        linkOrder: [
          { required: true, message: "链接顺序不能为空", trigger: "blur" }
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
    /** 查询链接列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then(response => {
        this.infoList = response.data.list;
        this.total = response.data.total;
        // this.statusOptions = response.data.statusOptions;
        // this.pageNum = response.data.currentPage;
        this.loading = false;
      });
    },

    // 查询所属分类列表
    getType() {
      listNameType().then(response => {
        this.menuOptions = response.data;
        // this.pageNum = response.data.currentPage;
      });
    },

    // 状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.link_open);
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        plugLinkID: undefined,
        linkUsername: undefined,
        linkName: undefined,
        linkTypeID: undefined,
        linkUrl: undefined,
        linkTarget: "",
        linkOpen:"",
        linkQQ: "",
        linkEmail: "",
        linkRemark: "",
        linkOrder: 0,
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
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.link_id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 排序 */
    setSortMap(infoList){
      let sortMap = {}
      infoList.forEach(item => {
        sortMap[item.link_id] = item.link_order
      })
      return sortMap
    },
    handleSort(){
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
      this.open = true;
      this.title = "添加链接";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getType();
      const plugLinkID = row.link_id || this.ids
      getInfo(plugLinkID).then(response => {
        //this.form = response.data;
        let data = response.data
        if (data) {
          this.form = {
            plugLinkID: data.link_id,
            linkUsername: data.link_username,
            linkName: data.link_name,
            linkUrl: data.link_url,
            linkTarget: data.link_target,
            linkTypeID: data.link_typeid,
            linkEmail: data.link_email,
            linkRemark: data.link_remark,
            linkQQ: data.link_qq,
            linkOrder: data.link_order,
            linkOpen: data.link_open,
            // remark: data.remark
          }
        }

        this.open = true;
        this.title = "修改链接";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.plugLinkID != undefined) {
            updateInfo(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addInfo(this.form).then(response => {
              if (response.code === 0 ) {
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
      const plugLinkIDs = row.link_id ? [row.link_id] :  this.ids;
      this.$confirm('是否确认删除链接编号为"' + plugLinkIDs + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delInfo(plugLinkIDs);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
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
