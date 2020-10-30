<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="关键字" prop="keyWords">
        <el-input
          v-model="queryParams.keyWords"
          placeholder="请输入关键字"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="所属栏目" style="width:380px;" prop="cateId">
        <treeselect
          style="width:300px;"
          :multiple="true"
          :clearable="true"
          :searchable="true"
          v-model="queryParams.cateId"
          :options="menuOptions"
          :normalizer="normalizer"
          :show-count="true"
          placeholder="选择所属栏目"
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
      <el-table-column label="文章编号" prop="id" width="120" />
      <el-table-column label="文章标题" prop="news_title" :show-overflow-tooltip="true" />
      <el-table-column label="所属栏目" prop="cateList" width="160">
        <template slot-scope="scope">
          <span>{{showNewsCate(scope.row.cateList)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="作者" prop="user_nickname" align="center" width="100" />
      <el-table-column label="缩略图" align="center" width="100">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.thumbnail!=''"
            style="width: 60px; height: 50px"
            :src="apiUrl+'/'+scope.row.thumbnail"
            fit="fill"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        width="100"
        prop="news_status"
        :formatter="statusFormat"
      ></el-table-column>
      <el-table-column label="发布日期" align="center" prop="published_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.published_time) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改日期" align="center" prop="update_time" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.update_time) }}</span>
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

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="所属栏目" prop="cateIds">
              <treeselect
                :multiple="true"
                :clearable="true"
                :searchable="true"
                :disable-branch-nodes="true"
                :flat="true"
                v-model="form.cateIds"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择所属栏目"
                @input="loadModel"
              />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" placeholder="请输入文章标题" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="关键词" prop="keywords">
              <el-input v-model="form.keywords" placeholder="请输入文章关键词" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文章来源" prop="source">
              <el-input v-model="form.source" placeholder="请输入文章来源" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="摘要" prop="excerpt">
              <el-input
                v-model="form.excerpt"
                type="textarea"
                placeholder="请输入文章摘要"
                :autosize="{minRows: 4, maxRows: 4}"
                :style="{width: '100%'}"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="文章类型" prop="isJump">
              <el-radio-group v-model="form.isJump">
                <el-radio
                  v-for="dict in typeOptions.values"
                  :key="dict.key"
                  :label="dict.key"
                  @change="typeChange"
                >{{dict.value}}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="24" v-show="isJump">
            <el-form-item label="跳转地址" prop="jumpUrl">
              <el-input v-model="form.jumpUrl" placeholder="请输入跳转地址，例：http://www.baidu.com" />
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="缩略图" prop="description">
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

          <el-col :span="24">
            <el-form-item label="属性标记">
              <el-checkbox-group v-model="form.attr">
                <el-checkbox
                  v-for="dict in attrOptions.values"
                  :key="dict.key"
                  :label="dict.key"
                >{{dict.value}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="发布日期">
              <el-date-picker
                v-model="form.publishedTime"
                type="datetime"
                placeholder="选择日期时间"
                align="right"
                :picker-options="pickerOptions"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
      <CF :rule="createFormRules" ref="cf" />
    </el-dialog>
  </div>
</template>

<script>
import {
  list,
  addNews,
  getNews,
  updateNews,
  delNews,
  loadNewsModel,
} from "@/api/system/cms/news";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { getToken } from "@/utils/auth";
import CF from "@/components/createForm";


export default {
  name: "news",
  components: { Treeselect, CF},
  data() {
    return {
      // 总条数
      total: 0,
      //图片上传地址
      imageUrl: "",
      //上传加载
      upLoading: false,
      //是否跳转
      isJump: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 遮罩层
      loading: true,
      // 文章列表数据
      list: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //状态数据字典
      statusOptions: [],
      //附加状态数据字典
      attrOptions: [],
      //文章类型字典
      typeOptions: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        keyWords: "",
        cateId: [],
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        cateIds: [
          {
            type: "array",
            required: true,
            message: "请选择所属栏目",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "文章标题不能为空", trigger: "blur" },
        ],
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      createFormRules: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      list(this.queryParams).then((response) => {
        this.list = response.data.list;
        this.total = response.data.total;
        this.statusOptions = response.data.statusOptions;
        this.attrOptions = response.data.attrOptions;
        this.typeOptions = response.data.typeOptions;
        this.menuOptions = [];
        this.menuOptions = this.handleTree(
          response.data.menus,
          "id",
          "parent_id"
        );
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children,
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.menuOptions = [];
        const menu = { id: 0, name: "最顶级", children: [] };
        menu.children = this.handleTree(
          response.data.parentList,
          "id",
          "parent_id"
        );
        this.menuOptions.push(menu);
      });
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      return this.selectDictLabel(this.statusOptions.values, row.alwaysShow);
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      return this.selectDictLabel(this.statusOptions.values, row.news_status);
    },
    // 取消按钮
    cancel() {
      //this.$router.go("/config/dict/list");
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.createFormRules = []
      this.form = {
        id: undefined,
        title: "",
        cateIds: [],
        keywords: "",
        source: "",
        excerpt: "",
        isJump: "0",
        jumpUrl: "",
        thumbnail: "",
        publishedTime: this.parseTime(Date.parse(new Date()) / 1000),
        status: "0",
        attr: [],
        modelForm: {},
      };
      this.imageUrl = "";
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    handleSort() {
      let sortMap = {};
      this.menuList.forEach((item) => {
        sortMap[item.id] = item.list_order;
      });
      sortMenu(sortMap).then((response) => {
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
      this.isJump = false;
      this.open = true;
      this.title = "添加文章";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getNews(id).then((response) => {
        const info = response.data.news;
        this.form = {
          id: info.id,
          title: info.news_title,
          cateIds: response.data.menus,
          keywords: info.news_keywords,
          source: info.news_source,
          excerpt: info.news_excerpt,
          isJump: "" + info.is_jump,
          jumpUrl: info.jump_url,
          thumbnail: info.thumbnail,
          publishedTime: this.parseTime(info.published_time),
          status: "" + info.news_status,
          attr: [],
          modelForm: {},
        };
        if (info.is_top === 1) {
          this.form.attr.push("1");
        }
        if (info.recommended === 1) {
          this.form.attr.push("2");
        }
        if(info.is_slide==1){
          this.form.attr.push("3");
        }
        (this.imageUrl = info.thumbnail
          ? this.apiUrl + "/" + info.thumbnail
          : ""),
          (this.open = true);
        this.typeChange(info.is_jump);
        if(typeof(this.$refs["cf"])=="undefined"){
          this.loadModel()
        }
        this.title = "修改文章";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.modelForm = this.$refs['cf'].fApi.formData() //设置模型字段值
          if (this.form.id != undefined) {
            updateNews(this.form).then((response) => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addNews(this.form).then((response) => {
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
        type: "warning",
      })
        .then(function () {
          return delNews(ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function (response) {});
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.thumbnail = res.data.fileInfo.fileUrl;
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
    //栏目类型选择切换
    typeChange(value) {
      this.isJump = false;
      if (value == 1) {
        this.isJump = true;
      } else {
        this.isJump = false;
      }
      if (this.$refs["cf"]) {
        if (this.isJump) {
          this.$refs["cf"].fApi.hidden(true, "news_content");
        } else {
          this.$refs["cf"].fApi.hidden(false, "news_content");
        }
      }
    },

    showNewsCate(data) {
      let item = [];
      for (let i in data) {
        item.push(data[i]);
      }
      return item.join("，");
    },
    loadModel() {
      this.createFormRules = []
      if (this.form.cateIds.length == 0) {
        return;
      }
      //加载模型
      loadNewsModel(this.form.cateIds, this.form.id)
        .then((response) => {
          if (this.isJump) {
            response.data.map((item) => {
              if (item.field == "news_content") {
                item.hidden = true;
              }
            });
          }
          this.createFormRules = response.data;
        })
        .catch((err) => {
          this.form.cateIds = [];
        });
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
.cate-content {
  height: 600px;
}
</style>
