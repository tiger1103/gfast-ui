<template>
  <div class="system-sysOperLog-container">
    <el-card shadow="hover">
      <div class="system-sysOperLog-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="100px">
          <el-row>
            <el-col :span="8" class="colBlock">
              <el-form-item label="系统模块" prop="title">
                <el-input
                    v-model="tableData.param.title"
                    placeholder="请输入系统模块"
                    clearable
                    size="small"
                    @keyup.enter.native="sysOperLogList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" class="colBlock">
              <el-form-item label="请求方式" prop="requestMethod">
                <el-select v-model="tableData.param.requestMethod" placeholder="请选择请求方式" clearable size="small">
                  <el-option
                      v-for="dict in sys_oper_log_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" :class="!showAll ? 'colBlock' : 'colNone'">
              <el-form-item>
                <el-button type="primary" size="small" @click="sysOperLogList"><el-icon><ele-Search /></el-icon>搜索</el-button>
                <el-button size="small" @click="resetQuery(queryRef)"><el-icon><ele-Refresh /></el-icon>重置</el-button>
                <el-button type="primary" link size="small" @click="toggleSearch">
                  {{ word }}
                  <el-icon v-show="showAll"><ele-ArrowUp/></el-icon>
                  <el-icon v-show="!showAll"><ele-ArrowDown /></el-icon>
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8" :class="showAll ? 'colBlock' : 'colNone'">
              <el-form-item label="操作人员" prop="operName">
                <el-input
                    v-model="tableData.param.operName"
                    placeholder="请输入操作人员"
                    clearable
                    size="small"
                    @keyup.enter.native="sysOperLogList"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8" :class="showAll ? 'colBlock' : 'colNone'">
              <el-form-item label="操作时间" prop="dateRange">
                <el-date-picker
                    clearable size="small" style="width: 200px"
                    v-model="tableData.param.dateRange"
                    type="daterange"
                    range-separator="-"
                    value-format="YYYY-MM-DD"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8" :class="showAll ? 'colBlock' : 'colNone'">
              <el-form-item>
                <el-button type="primary" size="small" @click="sysOperLogList"><el-icon><ele-Search /></el-icon>搜索</el-button>
                <el-button size="small" @click="resetQuery(queryRef)"><el-icon><ele-Refresh /></el-icon>重置</el-button>
                <el-button type="primary" link size="small" @click="toggleSearch">
                  {{ word }}
                  <el-icon v-show="showAll"><ele-ArrowUp/></el-icon>
                  <el-icon v-show="!showAll"><ele-ArrowDown /></el-icon>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
                type="danger"
                size="small"
                :disabled="multiple"
                @click="handleDelete(null)"
                v-auth="'api/v1/system/sysOperLog/delete'"
            ><el-icon><ele-Delete /></el-icon>删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button size="small" type="danger" class="ml10" @click="onRowClear()">
              <el-icon>
                <ele-Delete />
              </el-icon>
              清空日志
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-table v-loading="loading" :data="tableData.data" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日志编号" align="center" prop="operId"
                         min-width="100px"
        />
        <el-table-column label="系统模块" align="center" prop="title"
                         min-width="100px"
        />
        <el-table-column label="请求方式" align="center" prop="requestMethod" :formatter="requestMethodFormat"
                         min-width="100px"
        />
        <el-table-column label="操作人员" align="center" prop="operName"
                         min-width="100px"
        />
        <el-table-column label="部门名称" align="center" prop="deptName"
                         min-width="100px"
        />
        <el-table-column label="请求URL" align="center" prop="operUrl"
                         min-width="100px"
                         :show-overflow-tooltip="true"
        />
        <el-table-column label="主机地址" align="center" prop="operIp"
                         min-width="100px"
        />
        <el-table-column label="操作地点" align="center" prop="operLocation"
                         min-width="100px"
        />
        <el-table-column label="操作时间" align="center" prop="operTime"
                         min-width="120px"
        >
          <template #default="scope">
            <span>{{ proxy.parseTime(scope.row.operTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding" min-width="120px" fixed="right">
          <template #default="scope">
            <el-button
                size="small"
                type="primary"
                link
                icon="el-icon-view"
                @click="handleView(scope.row)"
                v-auth="'api/v1/system/sysOperLog/view'"
            >详情</el-button>
            <el-button
                size="small"
                type="primary"
                link
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-auth="'api/v1/system/sysOperLog/delete'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="sysOperLogList"
      />
    </el-card>
    <apiV1SystemSysOperLogDetail
        ref="detailRef"
        :requestMethodOptions="sys_oper_log_type"
        :deptNameOptions="deptNameOptions"
        @sysOperLogList="sysOperLogList"
    ></apiV1SystemSysOperLogDetail>
  </div>
</template>
<script lang="ts">
import {ItemOptions} from "/@/api/items";
import {toRefs, reactive, onMounted, ref, defineComponent, computed,getCurrentInstance,toRaw} from 'vue';
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus';
import {
  listSysOperLog,
  delSysOperLog,
  clearOperLog,
} from "/@/api/system/monitor/operLog";
import {
  SysOperLogTableColumns,
  SysOperLogInfoData,
  SysOperLogTableDataState,
} from "/@/views/system/monitor/operLog/component/model"
import apiV1SystemSysOperLogDetail from "/@/views/system/monitor/operLog/component/detail.vue"
export default defineComponent({
  name: "apiV1SystemSysOperLogList",
  components:{
    apiV1SystemSysOperLogDetail
  },
  setup() {
    const {proxy} = <any>getCurrentInstance()
    const loading = ref(false)
    const queryRef = ref()
    const editRef = ref();
    const detailRef = ref();
    // 是否显示所有搜索选项
    const showAll =  ref(false)
    // 非单个禁用
    const single = ref(true)
    // 非多个禁用
    const multiple =ref(true)
    const word = computed(()=>{
      if(showAll.value === false) {
        //对文字进行处理
        return "展开搜索";
      } else {
        return "收起搜索";
      }
    })
    // 字典选项数据
    const {
      sys_oper_log_type,
    } = proxy.useDict(
      'sys_oper_log_type',
    )
    // deptNameOptions关联表数据
    const deptNameOptions = ref<Array<ItemOptions>>([])
    const state = reactive<SysOperLogTableDataState>({
      operIds:[],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          requestMethod: undefined,
          operName: undefined,
          status: undefined,
          dateRange: []
        },
      },
    });
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 初始化表格数据
    const initTableData = () => {
      sysOperLogList()
    };
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      sysOperLogList()
    };
    // 获取列表数据
    const sysOperLogList = ()=>{
      loading.value = true
      listSysOperLog(state.tableData.param).then((res:any)=>{
        let list = res.data.list??[];
        state.tableData.data = list;
        state.tableData.total = res.data.total;
        loading.value = false
      })
    };
    const toggleSearch = () => {
      showAll.value = !showAll.value;
    }
    // 请求方式字典翻译
    const requestMethodFormat = (row:SysOperLogTableColumns) => {
      return proxy.selectDictLabel(sys_oper_log_type.value, row.requestMethod);
    }
    // 多选框选中数据
    const handleSelectionChange = (selection:Array<SysOperLogInfoData>) => {
      state.operIds = selection.map(item => item.operId)
      single.value = selection.length!=1
      multiple.value = !selection.length
    }
    const handleAdd =  ()=>{
      editRef.value.openDialog()
    }
    const handleUpdate = (row: SysOperLogTableColumns) => {
      if(!row){
        row = state.tableData.data.find((item:SysOperLogTableColumns)=>{
          return item.operId ===state.operIds[0]
        }) as SysOperLogTableColumns
      }
      editRef.value.openDialog(toRaw(row));
    };
    const handleDelete = (row: SysOperLogTableColumns) => {
      let msg = '你确定要删除所选数据？';
      let ids:number[] = [] ;
      if(row){
        msg = `此操作将永久删除数据，是否继续?`
        ids = [row.operId]
      }else{
        ids = state.operIds
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
            delSysOperLog(ids).then(()=>{
              ElMessage.success('删除成功');
              sysOperLogList();
            })
          })
          .catch(() => {});
    }
    // 清空日志
    const onRowClear = () => {
      ElMessageBox.confirm('你确定要删除所选数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            clearOperLog().then(()=>{
              ElMessage.success('清除成功');
              sysOperLogList();
            })
          })
          .catch(() => {});
    };
    const handleView = (row:SysOperLogTableColumns)=>{
      detailRef.value.openDialog(toRaw(row));
    }
    return {
      proxy,
      editRef,
      detailRef,
      showAll,
      loading,
      single,
      multiple,
      word,
      queryRef,
      resetQuery,
      sysOperLogList,
      toggleSearch,
      requestMethodFormat,
      sys_oper_log_type,
      //关联表数据选项
      deptNameOptions,
      handleSelectionChange,
      handleAdd,
      handleUpdate,
      handleDelete,
      handleView,
      onRowClear,
      ...toRefs(state),
    }
  }
})
</script>
<style lang="scss" scoped>
.colBlock {
  display: block;
}
.colNone {
  display: none;
}
</style>
