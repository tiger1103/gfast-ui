<template>
  <div class="app-container">
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

    <el-table v-loading="loading" :data="fieldsList" row-key="field_id" @selection-change="handleSelectionChange" ref="dragTable" >
      <el-table-column align="center"  width="40">
        <template slot-scope="{}">
          <svg-icon class="drag-handler" icon-class="drag" />
        </template>
      </el-table-column>
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="字段编号" align="center" width="50" prop="field_id" />
      <el-table-column label="字段名称" align="center" prop="field_name" />
      <el-table-column label="字段标题" align="center" prop="field_title" />
      <el-table-column label="字段类型" align="center" prop="field_type" />
      <el-table-column label="字段规则" align="center" prop="field_rules" />
      <el-table-column label="主键" min-width="30">
          <template slot-scope="scope">
            <el-radio :label="scope.row.field_id"  v-model="fieldPkId">是</el-radio>
          </template>
      </el-table-column>
      <el-table-column label="排序字段" min-width="30">
          <template slot-scope="scope">
            <el-checkbox true-label="1" v-model="scope.row.model_sort"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="列表显示" min-width="30">
          <template slot-scope="scope">
            <el-checkbox true-label="1" v-model="scope.row.model_list"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="可编辑" min-width="30">
          <template slot-scope="scope">
            <el-checkbox true-label="1" v-model="scope.row.model_edit"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="模型索引" min-width="30">
          <template slot-scope="scope">
            <el-checkbox true-label="1" v-model="scope.row.model_indexes"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="列表查询" min-width="30">
          <template slot-scope="scope">
            <el-checkbox true-label="1" v-model="scope.row.search_list"></el-checkbox>
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

    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button type="primary" @click="submitFormList()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>

    <!-- 添加或修改字段对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item label="字段名称" prop="fieldName">
          <el-input v-model="form.fieldName" placeholder="请输入字段名称" />
        </el-form-item>
        <el-form-item label="字段标题" prop="fieldTitle">
          <el-input v-model="form.fieldTitle" placeholder="请输入字段标题" />
        </el-form-item>
        <el-form-item label="字段类型" prop="fieldType">
          <el-select v-model="form.fieldType" @change="typeChange">
            <el-option
              v-for="item in fieldsType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="fieldData" v-show="tagShow.inputData">
            <span slot="label">
                字段数据
                <el-tooltip content="格式:'1:text1,2:text2,3:text3' 或 '数据表名|值字段名|标题字段名(|排序字段)(|条件)' 或 :字典编码" placement="top-start" >
                <i class="el-icon-question"></i>
                </el-tooltip>
            </span>
            <el-input v-model="form.fieldData" placeholder="请输入字段数据" />
        </el-form-item>
        <el-form-item label="字段长度" prop="fieldLength" v-show="tagShow.inputLength">
            <el-input v-model="form.fieldLength" placeholder="请输入字段长度" />
        </el-form-item>
        <el-form-item label="字段默认值" prop="fieldDefault" v-show="tagShow.inputDefault">
            <el-input v-model="form.fieldDefault" placeholder="请输入字段默认值 地图类型时'lng,lat'" />
        </el-form-item>
        <el-form-item label="字段说明" prop="fieldDesc">
            <el-input v-model="form.fieldDesc" placeholder="请输入字段说明" />
        </el-form-item>
        <el-form-item label="字段规则" prop="fieldRules" v-show="tagShow.inputRules">
          <el-select v-model="form.fieldRules" multiple>
            <el-option
              v-for="item in fieldsRules"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="字段列表显示宽度" prop="fieldWidth">
          <el-input v-model="form.fieldWidth" placeholder="请输入字段列表显示宽度" />
        </el-form-item>
        <el-form-item label="字段列表对齐方式" prop="fieldAlign">
          <el-input v-model="form.fieldAlign" placeholder="请输入字段列表对齐方式" />
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
import { addFields,fieldsList,setFieldsAttr,getField,updateFeild,delField } from "@/api/system/model/fields";
import Sortable from 'sortablejs'
export default {
  name: "Post",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      //主键字段ID
      fieldPkId:null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 字段表格数据
      fieldsList: [],
      oldList: [],
      newList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      //字段类型选项
      fieldsType:[
        {
            value: "text",
            label: "文本"
        },
        {
            value: "baidu_map",
            label: "百度地图坐标"
        },
        {
            value: "imagefile",
            label: "单图片"
        },
        {
            value: "images",
            label: "多图片"
        },
        {
            value: "file",
            label: "单文件"
        },
        {
            value: "files",
            label: "多文件"
        },
        {
            value: "selecttext",
            label: "选择文本"
        },
        {
            value: "currency",
            label: "货币"
        },
        {
            value: "large_number",
            label: "长整型"
        },
        {
            value: "number",
            label: "整数"
        },
        {
            value: "datetime",
            label: "日期时间"
        },
        {
            value: "date",
            label: "日期"
        },
        {
            value: "selectnumber",
            label: "选择数字"
        },
        {
            value: "richtext",
            label: "富文本"
        },
        {
            value: "bigtext",
            label: "文本域"
        },
        {
            value: "switch",
            label: "开关"
        },
        {
            value: "checkbox",
            label: "多选框"
        },
        {
           value:"DepartmentSelector",
           label:"部门选择器"
        }
      ],
      //字段规则
      fieldsRules:[
          {
              value:'lengthfixed',
              label:'lengthfixed'
          },
          {
              value:'required',
              label:'required'
          },
          {
              value:'unsigned',
              label:'unsigned'
          },
          {
              value:'unique',
              label:'unique'
          },
          {
              value:'readonly',
              label:'readonly'
          },
          {
              value:'hidden',
              label:'hidden'
          }
      ],
      //选择数据类型
      dataSelect:['selecttext', 'checkbox', 'selectnumber'],
      //字段属性标记
      tagShow:{
          inputData:false,
          inputLength:false,
          inputDefault:false,
          inputRules:true
      },
      //模型id
      modelId:0,
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fieldName: [
          { required: true, message: "字段名称不能为空", trigger: "blur" }
        ],
        fieldTitle: [
          { required: true, message: "字段标题不能为空", trigger: "blur" }
        ],
        fieldType: [
          { required: true, message: "字段类型不能为空", trigger: "change" }
        ]
      }
    };
  },

  created() {
    const { modelId } = this.$route.query;
     if (modelId) {
       this.modelId = modelId
    }
    this.getList();
  },
  methods: {
    /** 查询字段列表 */
    getList() {
      this.loading = true;
      fieldsList(this.modelId).then(response => {
        this.fieldsList = response.data.list?response.data.list:[]
        this.oldList = this.fieldsList.map(v => {
          if(v.model_pk=="1"){
              this.fieldPkId = v.field_id
          }
           return v.field_id
          })
        this.newList = this.oldList.slice()
        this.loading = false;
        this.$nextTick(() => {
          this.setSort()
        })
      });
    },
    //字段类型选择
    typeChange(value){
        this.showOption(value)
    },
    showOption(value){
      if(this.dataSelect.includes(value)){
             this.tagShow.inputData = true
             this.tagShow.inputLength=false
      }else if(value=='text'){
            this.tagShow.inputData = false
            this.tagShow.inputLength=true
      }else{
          this.tagShow.inputData = false
            this.tagShow.inputLength=false
      }
      //是否图片
      if (value == 'imagefile' || value == 'images' || value == 'file' || value == 'files') {
          this.tagShow.inputDefault = false
      } else {
          this.tagShow.inputDefault = true
      }
      //是否切换开关
      if (value == 'switch') {
          this.tagShow.inputRules = false
      } else {
          this.tagShow.inputRules = true
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        fieldId:undefined,
        modelId:this.modelId,
        fieldName:undefined,
        fieldTitle:undefined,
        fieldType:"",
        fieldData:undefined,
        fieldLength:undefined,
        fieldDefault:undefined,
        fieldDesc:undefined,
        fieldRules:[],
        fieldWidth:"",
        fieldAlign:"",
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.field_id)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字段";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const fieldId = row.field_id || this.ids
      getField(fieldId).then(response => {
        let data = response.data
        if (data) {
          this.form = {
            fieldId:data.field_id,
            modelId:data.model_id,
            fieldName:data.field_name,
            fieldTitle:data.field_title,
            fieldType:data.field_type,
            fieldData:data.field_data,
            fieldLength:data.field_length,
            fieldDefault:data.field_default,
            fieldDesc:data.field_desc,
            fieldRules:data.field_rules!=""?data.field_rules.split(','):[],
            fieldWidth:data.field_width,
            fieldAlign:data.field_align,
          }
          this.showOption(this.form.fieldType)
        }
        
        this.open = true;
        this.title = "修改字段";
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.fieldId != undefined) {
            updateFeild(this.form).then(response => {
              if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addFields(this.form).then(response => {
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
    /**修改字段属性提交 */
    submitFormList(){
      setFieldsAttr(this.fieldsList,this.fieldPkId,this.modelId).then(response=>{
        if (response.code === 0) {
                this.msgSuccess("修改成功");
                this.getList();
              } else {
                this.msgError(response.msg);
              }
        })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const fieldIds = row.field_id ? [row.field_id] :  this.ids;
      this.$confirm('是否确认删除字段编号为"' + fieldIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delField(fieldIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    setSort() {
      const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        setData: function(dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: evt => {
          const targetRow = this.fieldsList.splice(evt.oldIndex, 1)[0]
          this.fieldsList.splice(evt.newIndex, 0, targetRow)
         
          const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
          this.newList.splice(evt.newIndex, 0, tempIndex)
        }
      })
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/model/list", query: { t: Date.now()}})
    }
  }
};
</script>