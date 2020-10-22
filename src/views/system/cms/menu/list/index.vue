<template>
  <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="栏目名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入栏目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="栏目状态" clearable size="small">
          <el-option
            v-for="dict in statusOptions.values"
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

    <el-table
      v-loading="loading"
      :data="menuList"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="handleSelectionChange"
    >
    <el-table-column
              el-table-column
              type="selection"
              width="50">
          </el-table-column>
      <el-table-column prop="name" label="栏目名称" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column
            prop="list_order"
            label="排序"
            width="80">
        <template slot-scope="scope">
            <el-input v-model="scope.row.list_order" size="mini"></el-input>
        </template>
      </el-table-column>
      <el-table-column prop="cate_type" label="分类类型" :formatter="typeFormat"  :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80"></el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.cate_type==1"
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
          >新增</el-button>

          <el-button size="mini"
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级栏目">
              <treeselect
                v-model="form.parent_id"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级栏目"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="关联模型" prop="model_id">
              <el-select v-model="form.model_id" >
                <el-option
                  v-for="item in modelOptions"
                  :key="item.model_id"
                  :label="item.model_title"
                  :value="item.model_id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.cate_type">
                <el-radio
                  v-for="dict in typeOptions.values"
                  :key="dict.key"
                  :label="dict.key"
                  @change="typeChange"
                >{{dict.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="栏目名称" prop="name">
              <el-input v-model="form.name" placeholder="请输入栏目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="栏目别名" prop="alias">
              <el-input v-model="form.alias" placeholder="请输入栏目别名" />
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="isJump">
            <el-form-item label="跳转地址" prop="cate_address">
              <el-input v-model="form.cate_address" placeholder="请输入跳转地址，例：http://www.baidu.com" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="栏目描述" prop="description">
              <el-input v-model="form.description" type="textarea" placeholder="请输入栏目描述"
                :autosize="{minRows: 4, maxRows: 4}" :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="isSingle" :key="'key_'+isSingle" class="cate-content">
            <el-form-item label="单页内容">
              <Editor v-model="form.cate_content" @setEditContent="setEditContent" ref="cke"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="栏目图片" prop="description">
            <el-upload
              v-loading="upLoading"
              class="avatar-uploader"
              :action="apiUrl+'/system/upload/upImg'"
              :show-file-list="false"
              name="file"
              :data="setUpData()"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio
                v-for="dict in statusOptions.values"
                :key="dict.key"
                :label="dict.key"
              >{{dict.value}}</el-radio>
            </el-radio-group>
          </el-form-item>
          </el-col>
          <el-col :span="24" v-show="!isSingle&&!isJump">
            <el-form-item label="列表页模板" prop="list_template">
              <el-select v-model="form.list_template" >
                <el-option
                  v-for="item in list_template"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="form.cate_type!=1 && !isJump">
            <el-form-item label="内容页模板" prop="content_template">
              <el-select v-model="form.content_template" >
                <el-option
                  v-for="item in content_template"
                  :key="item"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
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
import { list,treeselect,sortMenu,addMenu,getMenu,updateMenu,delMenu,getModelOptions} from "@/api/system/cms/category";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from '@/utils/auth';
import Editor from '@/components/CKeditor';

export default {
  name: "Menu",
  components: { Treeselect,Editor},
  data() {
    return {
      //图片上传地址
      imageUrl: '',
      //上传加载
      upLoading:false,
      //是否跳转栏目
      isJump:false,
      //是否单页栏目
      isSingle:false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 遮罩层
      loading: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      typeOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      //模型选项
      modelOptions:[],
      // 查询参数
      queryParams: {
        name: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: "栏目名称不能为空", trigger: "blur" }
        ],
        model_id: [
          { required: true, message: "请选择栏目模型", trigger: "change" }
        ]
      },
      list_template:[],
      content_template:[]
    };
  },
  created() {
    this.getList();
    this.getModelOptions();
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data.list, "id","parent_id");
        this.typeOptions = response.data.typeOptions
        this.statusOptions = response.data.statusOptions
        this.loading = false;
      });
    },
    /**获取模型选项 */
    getModelOptions(){
      getModelOptions().then(response=>{
        this.modelOptions = response.data
      })
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      treeselect().then(response => {
        this.menuOptions = [];
        const menu = { id: 0, name: '最顶级', children: [] };
        menu.children = this.handleTree(response.data.parentList, "id","parent_id");
        this.menuOptions.push(menu);
        this.list_template = response.data.listTemp
        this.content_template = response.data.contentTemp
      });
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      return this.selectDictLabel(this.statusOptions.values, row.alwaysShow);
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions.values, row.status);
    },
    typeFormat(row,column){
      return this.selectDictLabel(this.typeOptions.values,row.cate_type);
    },
    // 取消按钮
    cancel() {
      //this.$router.go("/config/dict/list");
      this.open=false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        model_id:undefined,
        parent_id: 0,
        name: '',
        alias: '',
        cate_type: "1",
        description: '',
        status: "1",
        input_seo_title:'',
        input_seo_keywords:'',
        input_seo_description:'',
        thumbnail:'',
        cate_address:'',
        cate_content:'',
        list_template:"",
        content_template:"",
      };
      this.imageUrl='';
      this.isJump=false
      this.isSingle = false
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    setSortMap(menuList){
      let sortMap = {}
      menuList.forEach(item => {
        sortMap[item.id] = item.list_order
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
        this.form.parent_id = row.id;
      }
      this.open = true;
      this.title = "添加栏目";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getMenu(id).then(response => {
        this.menuOptions = [];
        const menu = { id: 0, name: '最顶级', children: [] };
        menu.children = this.handleTree(response.data.parentList, "id","parent_id");
        this.menuOptions.push(menu);
        this.list_template = response.data.listTemp
        this.content_template = response.data.contentTemp
        const menuInfo = response.data.menuInfo
        const more = menuInfo.more!=''?JSON.parse(menuInfo.more):null
        this.form = {
          id: menuInfo.id,
          model_id:menuInfo.model_id,
          parent_id: menuInfo.parent_id,
          name: menuInfo.name,
          alias: menuInfo.alias,
          cate_type: ''+menuInfo.cate_type,
          description: menuInfo.description,
          status: ''+menuInfo.status,
          input_seo_title:menuInfo.seo_title,
          input_seo_keywords:menuInfo.seo_keywords,
          input_seo_description:menuInfo.seo_description,
          thumbnail:more?more.thumb:'',
          cate_address:menuInfo.cate_address,
          cate_content:menuInfo.cate_content,
          list_template:menuInfo.list_template,
          content_template:menuInfo.content_template,
        }
        this.imageUrl = more?(this.apiUrl+"/"+more.thumb):'',
        this.typeChange(menuInfo.cate_type)
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateMenu(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addMenu(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$confirm('是否确认删除名称为"' + ids + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delMenu(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function(response) {});
    },
    handleAvatarSuccess(res, file) {
      if(res.code===0){
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.thumbnail = res.data.fileInfo.fileUrl;
      }else{
        this.msgError(res.msg);
      }
       this.upLoading = false
    },
    beforeAvatarUpload(file) {
      this.upLoading = true
      return true;
    },
    setUpData(){
      return {token:getToken()}
    },
    //栏目类型选择切换
    typeChange(value){
      this.isJump=false
      this.isSingle = false
      if(value==3){
        this.isJump=true
      }else if(value==4){
        this.isSingle = true
      }
    },
    setEditContent(data){
      this.form.cate_content = data
    }
  }
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
    border-color: #409EFF;
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
  }
</style>
