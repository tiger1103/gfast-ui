<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <basic-info-form ref="basicInfo" :info="info" />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="cloum">
        <el-alert
          title="⚠️表字段中的created_by、updated_by、updated_at、deleted_at的字段在此列表中已经隐藏"
          type="warning"
          show-icon
        />
        <el-table ref="dragTable" :data="cloumns" row-key="columnId" :max-height="tableHeight" width="100%">
          <el-table-column label="序号" type="index" width="50" fixed />
          <el-table-column
            label="字段列名"
            prop="columnName"
            width="150"
            fixed
            :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" width="150" fixed>
            <template slot-scope="scope">
              <el-input v-model="scope.row.columnComment"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            class-name="allowDrag"
            label="物理类型"
            prop="columnType"
            width="120"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="go类型" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.goType">
                <el-option label="int" value="int" />
                <el-option label="uint" value="uint" />
                <el-option label="int64" value="int64" />
                <el-option label="uint64" value="uint64" />
                <el-option label="float64" value="float64" />
                <el-option label="string" value="string" />
                <el-option label="Time" value="Time" />
                <el-option label="byte" value="byte" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="go属性" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.goField"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="json属性" width="150">
            <template slot-scope="scope">
              <el-input v-model="scope.row.htmlField" />
            </template>
          </el-table-column>

          <el-table-column label="插入" width="50">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.isInsert" :disabled="scope.row.isPk=='1' || scope.row.columnName=='created_at'"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" width="50">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.isEdit" :disabled="scope.row.isPk=='1' || scope.row.columnName=='created_at'"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表" width="50">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.isList" :disabled="scope.row.htmlField==info.treeParentCode"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询" width="50">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.isQuery" :disabled="scope.row.htmlField==info.treeParentCode"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" width="120">
            <template slot-scope="scope">
              <el-select v-model="scope.row.queryType">
                <el-option label="=" value="EQ" />
                <el-option label="!=" value="NE" />
                <el-option label=">" value="GT" />
                <el-option label=">=" value="GTE" />
                <el-option label="<" value="LT" />
                <el-option label="<=" value="LTE" />
                <el-option label="LIKE" value="LIKE" />
                <el-option label="BETWEEN" value="BETWEEN" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="必填" width="50">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.isRequired"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="显示类型" width="140">
            <template slot-scope="scope">
              <el-select v-model="scope.row.htmlType" :disabled="scope.row.htmlField==info.treeParentCode">
                <el-option label="文本框" value="input" />
                <el-option label="文本域" value="textarea" />
                <el-option label="下拉框" value="select" />
                <el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" />
                <el-option label="日期控件" value="datetime" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dictType" clearable filterable placeholder="请选择">
                <el-option
                  v-for="dict in dictOptions"
                  :key="dict.dictType"
                  :label="dict.dictName"
                  :value="dict.dictType">
                  <span style="float: left">{{ dict.dictName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dictType }}</span>
              </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="关联表" width="160">
            <template slot-scope="scope">
              <el-select v-model="scope.row.linkTableName" clearable filterable placeholder="请选择" @change="handleChangeConfig(scope.row,scope.$index)">
                <el-option
                  v-for="table in relationTable"
                  :key="table.tableName"
                  :label="table.tableName"
                  :value="table.tableName"
                >
                  <span style="float: left">{{ table.tableName }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ table.tableComment }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="关联表key" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.linkLabelId" clearable filterable placeholder="请选择">
                <el-option
                  v-for="column in scope.row.fkCol"
                  :key="column.columnName"
                  :label="column.columnName"
                  :value="column.htmlField"
                >
                  <span style="float: left">{{ column.htmlField }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ column.columnComment }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="关联表value" width="150">
            <template slot-scope="scope">
              <el-select v-model="scope.row.linkLabelName" clearable filterable placeholder="请选择">
                <el-option
                  v-for="column in scope.row.fkCol"
                  :key="column.columnName"
                  :label="column.columnName"
                  :value="column.htmlField"
                >
                  <span style="float: left">{{ column.htmlField }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ column.columnComment }}</span>
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="生成信息" name="genInfo">
        <gen-info-form ref="genInfo" :info="info"/>
      </el-tab-pane>
    </el-tabs>
    <el-form label-width="100px">
      <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
        <el-button type="primary" @click="submitForm()">提交</el-button>
        <el-button @click="close()">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { getGenTable, updateGenTable ,getRelationTable} from "@/api/tool/gen";
import { optionselect as getDictOptionselect } from "@/api/system/dict/type";
import basicInfoForm from "./basicInfoForm";
import genInfoForm from "./genInfoForm";
import Sortable from 'sortablejs'
export default {
  name: "GenEdit",
  components: {
    basicInfoForm,
    genInfoForm
  },
  data() {
    return {
      // 选中选项卡的 name
      activeName: "cloum",
      // 表格的高度
      tableHeight: document.documentElement.scrollHeight - 245 + "px",
      // 表列信息
      cloumns: [],
      // 字典信息
      dictOptions: [],
      // 表详细信息
      info: {},
      //关联表选项
      relationTable:[],
    };
  },
  beforeCreate() {
    const { tableId } = this.$route.query;
    if (tableId) {
      // 获取表详细信息
      getGenTable(tableId).then(res => {
        let columns = []
        columns = res.data.rows.filter(item=>{
          return !['created_by','updated_by','updated_at','deleted_at'].includes(item.columnName)
        })
        this.cloumns = columns;
        this.info = res.data.info;
        this.info.columns = this.cloumns;
      });
      /** 查询字典下拉列表 */
      getDictOptionselect().then(response => {
        this.dictOptions = response.data;
      });
      //获取关联选项表
      getRelationTable().then(res=>{
        this.relationTable = res.data
      })
    }
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      const basicForm = this.$refs.basicInfo.$refs.basicInfoForm;
      const genForm = this.$refs.genInfo.$refs.genInfoForm;
      Promise.all([basicForm, genForm].map(this.getFormPromise)).then(res => {
        const validateResult = res.every(item => !!item);
        if (validateResult) {
          const genTable = Object.assign({}, basicForm.model, genForm.model);
          genTable.columns = this.cloumns;
          genTable.params = {
            treeCode: genTable.treeCode,
            treeName: genTable.treeName,
            treeParentCode: genTable.treeParentCode
          };
          updateGenTable(genTable).then(res => {
            this.msgSuccess(res.data);
            if (res.code === 0) {
              this.close();
            }
          });
        } else {
          this.msgError("表单校验未通过，请重新检查提交内容");
        }
      });
    },
    //子组件修改info的column
    setInfoColumn(column){
        this.info.column = column;
    },
    getFormPromise(form) {
      return new Promise(resolve => {
        form.validate(res => {
          resolve(res);
        });
      });
    },
    /** 关闭按钮 */
    close() {
      this.$store.dispatch("tagsView/delView", this.$route);
      this.$router.push({ path: "/system/tools/gen", query: { t: Date.now()}})
    },
    handleChangeConfig(row, index) {
      this.relationTable.filter(function(item) {
        if (item.tableName === row.linkTableName) {
          row.fkCol = item.columns
        }
      })
    },
  },
  mounted() {
    const el = this.$refs.dragTable.$el.querySelectorAll(".el-table__body-wrapper > table > tbody")[0];
    const sortable = Sortable.create(el, {
      handle: ".allowDrag",
      onEnd: evt => {
        const targetRow = this.cloumns.splice(evt.oldIndex, 1)[0];
        this.cloumns.splice(evt.newIndex, 0, targetRow);
        for (let index in this.cloumns) {
          this.cloumns[index].sort = parseInt(index) + 1;
        }
      }
    });
  }
};
</script>

<style>
 .allowDrag{cursor: move;}
</style>
