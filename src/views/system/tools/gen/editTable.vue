<template>
  <el-card>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="basic">
        <basic-info-form ref="basicInfo" :info="info" />
      </el-tab-pane>
      <el-tab-pane label="字段信息" name="cloum">
        <el-table ref="dragTable" :data="cloumns" row-key="columnId" :max-height="tableHeight">
          <el-table-column label="序号" type="index" min-width="5%" class-name="allowDrag" />
          <el-table-column
            label="字段列名"
            prop="column_name"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="字段描述" min-width="10%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.column_comment"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="物理类型"
            prop="column_type"
            min-width="10%"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="go类型" min-width="11%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.go_type">
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
          <el-table-column label="go属性" min-width="10%">
            <template slot-scope="scope">
              <el-input v-model="scope.row.go_field"></el-input>
            </template>
          </el-table-column>

          <el-table-column label="插入" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.is_insert"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="编辑" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.is_edit"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="列表" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.is_list"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.is_query"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="查询方式" min-width="10%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.query_type">
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
          <el-table-column label="必填" min-width="5%">
            <template slot-scope="scope">
              <el-checkbox true-label="1" v-model="scope.row.is_required"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column label="显示类型" min-width="12%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.html_type">
                <el-option label="文本框" value="input" />
                <el-option label="文本域" value="textarea" />
                <el-option label="下拉框" value="select" />
                <el-option label="单选框" value="radio" />
                <el-option label="复选框" value="checkbox" />
                <el-option label="日期控件" value="datetime" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="字典类型" min-width="12%">
            <template slot-scope="scope">
              <el-select v-model="scope.row.dict_type" clearable filterable placeholder="请选择">
                <el-option
                  v-for="dict in dictOptions"
                  :key="dict.dict_type"
                  :label="dict.dict_name"
                  :value="dict.dict_type">
                  <span style="float: left">{{ dict.dict_name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ dict.dict_type }}</span>
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
import { getGenTable, updateGenTable } from "@/api/tool/gen";
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
      info: {}
    };
  },
  beforeCreate() {
    const { tableId } = this.$route.query;
    if (tableId) {
      // 获取表详细信息
      getGenTable(tableId).then(res => {
        this.cloumns = res.data.rows;
        this.info = res.data.info;
        this.info.columns = this.cloumns;
      });
      /** 查询字典下拉列表 */
      getDictOptionselect().then(response => {
        this.dictOptions = response.data;
      });
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
            this.msgSuccess(res.msg);
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
    }
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
