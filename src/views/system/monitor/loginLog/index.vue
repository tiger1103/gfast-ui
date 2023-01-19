<template>
  <div class="system-dic-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="登录IP" prop="ipaddr">
            <el-input
                v-model="tableData.param.ipaddr"
                placeholder="请输入登录地址"
                clearable
                style="width: 180px;"
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>

          <el-form-item label="登录地点" prop="loginLocation">
            <el-input
                v-model="tableData.param.loginLocation"
                placeholder="请输入登录地点"
                clearable
                style="width: 180px;"
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>

          <el-form-item label="用户名称" prop="userName">
            <el-input
                v-model="tableData.param.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 180px;"
                size="default"
                @keyup.enter.native="dataList"
            />
          </el-form-item>

          <el-form-item label="状态" prop="status">
            <el-select
                v-model="tableData.param.status"
                placeholder="登录状态"
                clearable
                size="default"
                style="width: 180px"
            >
              <el-option
                  v-for="dict in admin_login_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="登录时间" prop="dateRange">
            <el-date-picker
                v-model="tableData.param.dateRange"
                size="default"
                style="width: 240px"
                value-format="YYYY-MM-DD"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
            ></el-date-picker>
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
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除日志
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowClear()">
              <el-icon>
                <ele-Delete />
              </el-icon>
              清空日志
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="编号" align="center" prop="infoId" />
        <el-table-column label="登录名称" align="center" prop="loginName" />
        <el-table-column label="登录地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true" />
        <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
        <el-table-column label="浏览器" align="center" prop="browser" />
        <el-table-column label="操作系统" align="center" prop="os" />
        <el-table-column label="登录状态" align="center" prop="status" :formatter="statusFormat" />
        <el-table-column label="操作信息" align="center" prop="msg" />
        <el-table-column label="登录日期" align="center" prop="loginTime" width="180" />
        <el-table-column label="登录模块" alian="center" prop="module"></el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="dataList"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent,getCurrentInstance,unref } from 'vue';
import { ElMessageBox, ElMessage,FormInstance} from 'element-plus';
import { logList,deleteLog,clearLog } from '/@/api/system/monitor/loginLog';

// 定义接口来定义对象的类型
interface TableDataRow {
  infoId:number;
  loginName:string;
  ipaddr:string;
  loginLocation:string;
  browser:string;
  os:string;
  status:number;
  msg:string;
  loginTime:string;
  module:string;
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
      dateRange: string[];
      status: string;
      ipaddr:string;
      loginLocation:string;
      userName:string;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemLoginLogList',
  setup() {
    const {proxy} = getCurrentInstance() as any;
    const queryRef = ref();
    const {admin_login_status} = proxy.useDict('admin_login_status')
    const state = reactive<TableDataState>({
      ids:[],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          pageNum: 1,
          pageSize: 10,
          dateRange: [],
          status: '',
          ipaddr:'',
          loginLocation:'',
          userName:''
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      dataList()
    };
    const dataList=()=>{
      logList(state.tableData.param).then((res:any)=>{
        state.tableData.data = res.data.list;
        state.tableData.total = res.data.total;
      });
    };
    // 删除日志
    const onRowDel = (row: TableDataRow) => {
      let msg = '你确定要删除所选数据？';
      let ids:number[] = [] ;
      if(row){
        msg = `此操作将永久删除：“${row.loginName}”，是否继续?`
        ids = [row.infoId]
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
            deleteLog(ids).then(()=>{
              ElMessage.success('删除成功');
              dataList();
            })
          })
          .catch(() => {});
    };
    // 清空日志
    const onRowClear = () => {
      ElMessageBox.confirm('你确定要删除所选数据？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            clearLog().then(()=>{
              ElMessage.success('清除成功');
              dataList();
            })
          })
          .catch(() => {});
    };
    // 页面加载时
    onMounted(() => {
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
      state.ids = selection.map(item => item.infoId)
    };
    // 登录状态字典翻译
    const statusFormat = (row:TableDataRow) => {
      return proxy.selectDictLabel(unref(admin_login_status), row.status);
    };
    return {
      queryRef,
      onRowDel,
      dataList,
      resetQuery,
      handleSelectionChange,
      statusFormat,
      onRowClear,
      admin_login_status,
      ...toRefs(state),
    };
  },
});
</script>
