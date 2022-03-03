<template>
  <div class="app-container" v-loading="importLoading" element-loading-text="请稍等，正在上传中......"  element-loading-spinner="el-icon-loading"    element-loading-background="rgba(0, 0, 0, 0.8)">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="插件名称" prop="pTitle">
        <el-input
            v-model="queryParams.pTitle"
            placeholder="请输入插件名称"
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
        <el-upload
          class="upload-demo"
          :show-file-list="false"
          :action="apiUrl+'/system/pluginsManage/installOffLine'"
          :data = "setUpData()"
          :before-upload="handleBeforeUpLoad"
          :on-progress="handleOnProgress"
          :on-success="handleUpSuccess"
          :on-change="handleUpChange"
        >
          <el-button size="mini" type="danger" icon="el-icon-upload2">离线安装{{upProcess}}</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-table v-loading="loading||installing" :data="pluginsManageList">
      <el-table-column label="插件ID" align="center" prop="pluginId" />
      <el-table-column label="插件名称" align="center" prop="pluginName" />
      <el-table-column label="插件介绍" align="center" prop="description" width="500"/>
      <el-table-column label="作者" align="center" prop="memName" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope" v-if="scope.row.isInstall===1">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="statusChange(scope.row)"
            ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="安装情况" align="center" prop="isInstall">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status==1?'success':'danger'">{{scope.row.status==1?'已安装':'未安装'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="当前版本" align="center" prop="version" />
      <el-table-column label="售价（元）" align="center" prop="pluginPriceStr" />
      <el-table-column label="下载次数" align="center" prop="downloadTimes" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-download"
            @click="handleInstall(scope.row)"
          >安装</el-button>
          <el-popover
            placement="bottom"
            trigger="click">
            <ul class="dropdown-menu">
              <li v-for="(item,index) in scope.row.pluginInfo" :key="'version_'+index">
                <el-button size="mini" type="text" @click="handleInstall(scope.row,item.infoVersion)">版本: {{item.infoVersion}}</el-button>
              </li>
            </ul>
            <el-button slot="reference" size="mini" type="text" icon="el-icon-arrow-down"></el-button>
          </el-popover>
<!--          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleUnInstall(scope.row)"
          >卸载</el-button>-->
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
    <!-- 插件管理登录对话框 -->
    <el-dialog :title="title" :visible.sync="openLogin" width="500px" append-to-body :close-on-click-modal="false">
      <el-alert
        title="⚠️温馨提示：此处登录账号为GFast官网账号"
        type="error"
        effect="dark"
        :closable="false"
        class="install-alert"
      />
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入用户名、手机号、邮箱"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
          >
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input
            v-model="form.verifyCode"
            auto-complete="off"
            placeholder="验证码"
            style="width: 63%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" />
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleLogin">登  录</el-button>
        <el-button @click="handleRegister">注册账号</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
    listPluginsManage,
    getPluginsManage,
    installPlugin,
    unInstallPlugin,
    changePluginsManageStatus,
    getCodeImgR,
    loginR
} from "@/api/system/pluginsManage";
import { getToken } from '@/utils/auth';
import Cookies from 'js-cookie'
export default {
  components:{
  },
  name: "PluginsManage",
  data() {
    return {
      // 遮罩层
      loading: true,
      //离线安装遮罩
      importLoading:false,
      upProcess:'',
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 插件管理表格数据
      pluginsManageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openLogin: false,
      // statusOptions字典数据
      statusOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        pName: undefined,
        pTitle: undefined,
        pAuth: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        username : [
          { required: true, message: "账号不能为空", trigger: "blur" }
        ],
        password : [
          { required: true, message: "密码不能为空", trigger: "blur" }
        ],
        verifyCode : [
          { required: true, message: "验证码不能为空", trigger: "blur" }
        ],
      },
      rToken:Cookies.get("rToken"),
      codeUrl: "",
      installing:false,//插件安装中...
    }
  },
  created() {
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data.values||[];
    });
    this.getList();
  },
  methods: {
    // 状态修改
    statusChange(row) {
      let text = row.status === 1 ? "启用" : "停用";
      this.$confirm('确认要"' + text + '"：吗?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return changePluginsManageStatus(row.pluginId, row.status);
        }).then(() => {
          this.msgSuccess(text + "成功");
        }).catch(function() {
          row.userStatus =row.userStatus === 0 ?1 : 0;
        });
    },
    /** 查询插件管理列表 */
    getList() {
      this.loading = true;
      listPluginsManage(this.queryParams).then(response => {
        let list = response.data.list || [];
        this.pluginsManageList = list;
        this.total = response.data.total;
        this.loading = false;
      });
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
        username:undefined,
        password:undefined,
        verifyCode:undefined,
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
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加插件管理";
    },
    /** 修改按钮操作 */
    handleInstall(row,version) {
      this.installing = true
      if(row.isInstall===1){
        this.$confirm('您已安装了该插件，版本号为：'+row.version+",确认要覆盖安装？", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          return this.install(row,version)
        }).catch((e) => {
          this.installing = false
        });
      }else{
        this.install(row,version)
      }
    },
    install(row,version){
      return installPlugin(row.pluginId,version,this.rToken).then(res=>{
        if(res.code!==0){
          this.msgError(res.msg)
        }else if(res.data.code===-401){
          Cookies.remove('rToken')
          this.getCode();
          this.openLogin = true
        }else{
          this.$confirm('插件安装成功，请按照插件内说明文件进行配置。', '提示', {
            confirmButtonText: '确定',
            showCancelButton:false,
            type: 'success'
          })
          this.getList()
        }
      }).catch(e=>{
        if(e.msg=='请求错误或登录超时'){
          Cookies.remove('rToken')
          this.getCode();
          this.openLogin = true
        }
      }).finally(()=>{
        this.installing = false
      })
    },
    /** 卸载操作 */
    handleUnInstall(row) {
      this.$confirm('是否确认卸载?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return unInstallPlugin(row.pluginId);
        }).then(() => {
          this.getList();
          this.msgSuccess("卸载成功");
        }).catch(function() {});
    },
    handleLogin(){
      this.$refs["form"].validate((valid) => {
        if (valid) {
          loginR(this.form).then(res=>{
            Cookies.set('rToken', res.data.token)
            this.rToken = res.data.token
            this.msgSuccess('登录成功')
            this.openLogin = false
          }).catch(err=>{
            this.getCode()
          })
        }
      })
    },
    handleRegister(){
      window.open("https://plugins.g-fast.cn/store#/login")
    },
    getCode() {
      getCodeImgR().then(res => {
        this.codeUrl = res.data.base64stringC;
        this.form.verifyKey = res.data.idKeyC;
      });
    },
    handleBeforeUpLoad(file){
      let fileType = file.type
      if(fileType!='application/zip'&&fileType!='application/x-zip-compressed'){
        this.$alert('只能上传zip压缩文件')
        return false
      }
      this.importLoading = true
      return true
    },
    handleOnProgress(event, file, fileList){
      let process = Math.ceil(event.percent)
      this.upProcess = process+'%'
      if(process==100){
        setTimeout(()=>{this.upProcess=''},800)
      }
    },
    handleUpSuccess(res, file) {
      if(res.code===0){
        this.$confirm('插件安装成功，请按照插件内说明文件进行配置。', '提示', {
          confirmButtonText: '确定',
          showCancelButton:false,
          type: 'success'
        })
        this.getList()
      }else{
        this.msgError(res.msg);
      }
      this.upProcess = ''
    },
    handleUpChange(){
      this.importLoading = false
    },
    setUpData(){
      let data = {token:getToken()}
      return data
    },
  }
};
</script>
<style scoped rel="stylesheet/scss" lang="scss">
  .dropdown-menu ,dropdown-menu li{
    padding:0;margin:0;list-style:none
  }
  .dropdown-menu li{
    text-align: center;
  }
  .dropdown-menu li:hover{
    background: rgba(225,229,255,0.75);
  }
  .install-alert{
    margin-bottom: 20px;
  }

  .login-code {
    width: 33%;
    height: 38px;
    float: right;
    img {
      cursor: pointer;
      vertical-align: middle;
      width:120px;
    }
  }
</style>
