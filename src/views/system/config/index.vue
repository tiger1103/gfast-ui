<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="字典类型" prop="dictType">
            <el-input
                v-model="tableData.param.dictType"
                placeholder="请输入字典类型"
                clearable
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>
          <el-form-item label="字典标签" prop="dictLabel">
            <el-input
                v-model="tableData.param.dictLabel"
                placeholder="请输入字典标签"
                clearable
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status" style="width: 200px;">
            <el-select
                v-model="tableData.param.status"
                placeholder="字典状态"
                clearable
                size="default"
                style="width: 240px"
            >
              <el-option label="启用"  :value="1"/>
              <el-option label="禁用"  :value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="dataList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" @click="resetQuery(queryRef)">
              <el-icon>
                <ele-Refresh />
              </el-icon>
              重置
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddDic">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增字典
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除字典
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="参数主键" align="center" prop="configId" />
        <el-table-column label="参数名称" align="center" prop="configName" :show-overflow-tooltip="true" />
        <el-table-column label="参数键名" align="center" prop="configKey" :show-overflow-tooltip="true" />
        <el-table-column label="参数键值" align="center" prop="configValue" />
        <el-table-column label="系统内置" align="center" prop="configType" :formatter="typeFormat" />
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createdAt" width="180" />
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" type="text" @click="onOpenEditDic(scope.row)">修改</el-button>
            <el-button size="small" type="text" @click="onRowDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="dataList"
      />
    </el-card>
    <EditParams ref="editDicRef" @dataList="dataList" :dict-type="tableData.param.dictType"/>
  </div>
</template>

<script lang="ts">
import {toRefs, reactive, onMounted, ref, defineComponent, toRaw, unref, getCurrentInstance, isRef} from 'vue';
import { ElMessageBox, ElMessage,FormInstance} from 'element-plus';
import EditParams from '/@/views/system/config/component/editParams.vue';
import { useRoute } from 'vue-router';
import {deleteConfig, getConfigList} from "/@/api/system/config";



// 定义接口来定义对象的类型
interface TableDataRow {
  configId: number;
  configName: string;
  configKey: string;
  configValue: string,
  configType: number,
  remark: string,
  createdAt: string,
}
interface TableDataState {
  ids:number[];
  tableData: {
    data: Array<TableDataRow>;
    total: number;
    loading: boolean;
    param: {
      pageNum: number;
      pageSize: number;
      dictType: string;
      dictLabel:string;
      status: string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemDictDataList',
  components: { EditParams },
  setup() {
    const {proxy} = getCurrentInstance() as any;
    const route = useRoute();
    const addDicRef = ref();
    const editDicRef = ref();
    const queryRef = ref();
    const {sys_yes_no} = proxy.useDict('sys_yes_no')
    const state = reactive<TableDataState>({
      ids:[],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          dictLabel:'',
          dictType:'',
          status:''
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList=()=>{
      getConfigList(state.tableData.param).then((res:any)=>{
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };
    // 打开新增字典弹窗
    const onOpenAddDic = () => {
      editDicRef.value.openDialog();
    };
    // 打开修改字典弹窗
    const onOpenEditDic = (row: TableDataRow) => {
      editDicRef.value.openDialog(row);
    };
    // 删除字典
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids:number[] = [] ;
      if(row){
        msg = `此操作将永久删除用户：“${row.configName}”，是否继续?`
        ids = [row.configId]
      }else{
        ids = state.ids
      }
      if(ids.length===0){
        ElMessage.error('请选择要删除的数据。');
        return
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            deleteConfig(ids).then(()=>{
              ElMessage.success('删除成功');
              dataList();
            })
          })
          .catch(() => {});
    };
    // 页面加载时
    onMounted(() => {
      const dictType = route.params && route.params.dictType;
      state.tableData.param.dictType = <string>dictType
      initTableData();
    });
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      dataList()
    };
    // 多选框选中数据
    const handleSelectionChange = (selection:TableDataRow[])=> {
      state.ids = selection.map(item => item.configId)
    };
    // 参数系统内置字典翻译
    const typeFormat=(row:TableDataRow) => {
      return proxy.selectDictLabel(unref(sys_yes_no), row.configType);
    };
    return {
      addDicRef,
      editDicRef,
      queryRef,
      sys_yes_no,
      onOpenAddDic,
      onOpenEditDic,
      onRowDel,
      dataList,
      resetQuery,
      handleSelectionChange,
      typeFormat,
      ...toRefs(state),
    };
  },
});
</script>
