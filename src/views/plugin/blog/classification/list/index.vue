<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="70px">
      <el-form-item label="分类名称" prop="classificationName">
        <el-input
          v-model="queryParams.classificationName"
          placeholder="请输入分类名称"
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

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="classification_id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="分类名称" align="center" prop="classification_name" :show-overflow-tooltip="true"/>
      <el-table-column label="分类类型" align="center" prop="classification_type" :formatter="typeFormat"/>
      <el-table-column label="分类状态" align="center" prop="classification_status" :formatter="statusFormat"/>
      <el-table-column
        prop="classification_sort"
        label="排序"
        width="80"
        >
        <template slot-scope="scope">
          <el-input v-model="scope.row.classification_sort" size="mini"></el-input>
        </template>
      </el-table-column>
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

    <!-- 添加、修改对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="950px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级栏目" prop="classification_pid">
              <treeselect
                v-model="form.classification_pid"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级栏目"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类类型">
              <el-radio-group v-model="form.classification_type" @change="typeSelect">
                <el-radio
                  v-for="dict in typeOptions"
                  :key="dict.key"
                  :label="dict.key"
                >{{dict.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类名称" prop="classification_name">
              <el-input v-model="form.classification_name" placeholder="请输入分类名称"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="分类描述" prop="classification_describe">
              <el-input v-model="form.classification_describe" type="textarea" autosize placeholder="请输入描述"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="flagAddress" label="跳转地址" prop="classification_address">
              <el-input v-model="form.classification_address" placeholder="请输入跳转地址"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="flagContent" label="单页内容" class="cate-content" prop="classification_content">
              <Editor v-model="form.classification_content" @setEditContent="setEditContent" ref="cke"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="排序" prop="classification_sort">
              <el-input-number v-model="form.classification_sort" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态" prop="classification_status">
              <el-radio-group v-model="form.classification_status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.key"
                  :label="dict.key"
                >{{dict.value}}</el-radio>
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
import {listInfo, getInfo , addInfo, updateInfo, delInfo, sortMenu, treeselect} from "@/api/plugin/blog/classification";
import {getToken} from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Editor from '@/components/CKeditor';

export default {
  components: { Treeselect,Editor},
  data() {
    return {
      //上传加载
      upLoading: false,
      // 判断是否显示跳转地址或内容
      flagAddress: false,
      flagContent: false,
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
      menuList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 分类类型数据字典
      typeOptions:[],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        classificationName: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        classification_name: [{required: true, message: "分类名称不能为空", trigger: "blur"},],
        classification_status: [{required: true, message: "状态不能为空", trigger: "blur"},],
        classification_pid: [{required: true, message: "上级栏目不能为空", trigger: "blur"},],
      },
    };
  },
  created() {
    this.getList();
    this.getDicts("sys_normal_disable").then((response) => {
      this.statusOptions = response.data.values || [];
    });
    this.getDicts("sys_blog_type").then((response) => {
      this.typeOptions = response.data.values || [];
    });
  },
  methods: {
    /** 查询列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.menuList =this.handleTree(response.data.list, "classification_id","classification_pid");
        this.total = response.data.total;
        this.loading = false;
      });
    },

    // 分类类型模式选择
    typeSelect(value) {
      if (value == 1) {
        this.flagAddress = false;
        this.flagContent = false;
      } else if (value == 2) {
        this.flagAddress = false;
        this.flagContent = false;
      } else if (value == 3) {
        this.flagAddress = true;
        this.flagContent = false;
      } else {
        this.flagAddress = false;
        this.flagContent = true;
      }
    },

    // 分类类型模式选择(用于修改)
    editTypeSelect() {
      if (this.form.classification_type == 1) {
        this.flagAddress = false;
        this.flagContent = false;
      }
      if (this.form.classification_type == 2) {
        this.flagAddress = false;
        this.flagContent = false;
      }
      if (this.form.classification_type == 3) {
        this.flagAddress = true;
        this.flagContent = false;
      }
      if (this.form.classification_type == 4) {
        this.flagAddress = false;
        this.flagContent = true;
      }
    },

    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.classification_id,
        label: node.classification_name,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.menuOptions = [];
        const menu = { classification_id: 0, classification_name: '最顶级', children: [] };
        menu.children = this.handleTree(response.data.parentList, "classification_id","classification_pid");
        this.menuOptions.push(menu);
      });
    },

    // 菜单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions, row.classification_status);
    },

    // 分类类型字典翻译
    typeFormat(row, column) {
      return this.selectDictLabel(this.typeOptions, row.classification_type);
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

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        classification_id: undefined,
        classification_name: undefined,
        classification_pid: 0,
        classification_sort: 0,
        classification_type: "0",
        classification_describe: "",
        classification_content: "",
        classification_address: "",
        classification_status:"1",
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
      this.ids = selection.map((item) => item.classification_id);
      this.names = selection.map((item) => item.classification_name);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 排序 */
    setSortMap(menuList){
      let sortMap = {}
      menuList.forEach(item => {
        sortMap[item.classification_id] = item.classification_sort
        if (item.children){
          sortMap = {...sortMap,...this.setSortMap(item.children)}
        }
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
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.classification_pid = row.classification_id;
      }
      this.flagContent = false;
      this.flagAddress = false;
      this.open = true;
      this.title = "新增分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const classificationId = row.classification_id || this.ids;
      getInfo(classificationId).then((response) => {
        this.menuOptions = [];
        const menu = { classification_id: 0, classification_name: '最顶级', children: [] };
        menu.children = this.handleTree(response.data.parentList, "classification_id","classification_pid");
        this.menuOptions.push(menu);
        let data = response.data.params;
        if (data) {
          this.form = {
            classification_id: data.classification_id,
            classification_name: data.classification_name,
            classification_describe: data.classification_describe,
            classification_address: data.classification_address,
            classification_content: data.classification_content,
            classification_sort: data.classification_sort,
            classification_pid: data.classification_pid,
            classification_type: ''+data.classification_type,
            classification_status: ''+data.classification_status,
          };
        }
        this.editTypeSelect();
        this.open = true;
        this.title = "修改";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.classification_id != undefined) {
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
      const classificationIds = row.classification_id ? [row.classification_id] : this.ids;
      const names = row.classification_name || this.names;
      this.$confirm(
        '是否确认删除名称为"' + names + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delInfo(classificationIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {
        });
    },
    setEditContent(data){
      this.form.classification_content = data
    }
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
