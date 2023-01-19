<template>
  <div class="system-post-container">
    <el-card shadow="hover">
      <div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true">
          <el-form-item label="登录IP" prop="ipaddr">
            <el-input size="default" v-model="tableData.param.ipaddr" placeholder="请输入登录IP" class="w-50 m-2" clearable/>
          </el-form-item>
          <el-form-item label="用户名称" prop="userName">
            <el-input size="default" v-model="tableData.param.userName" placeholder="请输入登录名称" class="w-50 m-2" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="getList">
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
              强制退出
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="uuid" label="会话编号" show-overflow-tooltip></el-table-column>
        <el-table-column prop="userName" label="登录名称"></el-table-column>
        <el-table-column prop="ip" label="主机" ></el-table-column>
        <el-table-column prop="explorer" label="浏览器" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作系统" align="center" prop="os" />
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button size="small" text type="primary" @click="onRowDel(scope.row)">强退</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="getList"
      />
    </el-card>
  </div>
</template>

<script lang="ts">
import {toRefs, reactive, onMounted, defineComponent, ref} from 'vue';
import {ElMessageBox, ElMessage, FormInstance} from 'element-plus';
import { forceLogout, listSysUserOnline} from "/@/api/system/monitor/userOnline";
// 定义接口来定义对象的类型
interface TableData {
  id: number;
  uuid: string;
  token: string;
  createTime: string;
  userName: string;
  ip: string;
  explorer: string;
  os: string;
}
interface TableDataState {
  ids:number[];
  tableData: {
    data: Array<TableData>;
    total: number;
    loading: boolean;
    param: {
      ipaddr:string;
      userName:string;
      pageNum: number;
      pageSize: number;
    };
  };
}

export default defineComponent({
  name: 'apiV1SystemOnlineList',
  setup() {
    const queryRef = ref();
    const state = reactive<TableDataState>({
      ids:[],
      tableData: {
        data: [],
        total: 0,
        loading: false,
        param: {
          ipaddr:'',
          userName:'',
          pageNum: 1,
          pageSize: 10,
        },
      },
    });
    // 初始化表格数据
    const initTableData = () => {
      getList()
    };
    const getList = ()=>{
      listSysUserOnline(state.tableData.param).then(res=>{
        state.tableData.data = res.data.list??[];
        state.tableData.total = res.data.total;
      })
    };
    /** 重置按钮操作 */
    const resetQuery = (formEl: FormInstance | undefined) => {
      if (!formEl) return
      formEl.resetFields()
      getList()
    };
    // 删除岗位
    const onRowDel = (row: TableData) => {
      let msg = '你确定要强制退出用户登录？';
      let ids:number[] = [] ;
      if(row){
        msg = `将强制用户下线，是否继续?`
        ids = [row.id]
      }else{
        ids = state.ids
      }
      if(ids.length===0){
        ElMessage.error('请选择要强制退出登录的用户。');
        return
      }
      ElMessageBox.confirm(msg, '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
          .then(() => {
            forceLogout(ids).then(()=>{
              ElMessage.success('退出成功');
              getList();
            })
          })
          .catch(() => {});
    };
    // 分页改变
    const onHandleSizeChange = (val: number) => {
      state.tableData.param.pageSize = val;
    };
    // 分页改变
    const onHandleCurrentChange = (val: number) => {
      state.tableData.param.pageNum = val;
    };
    // 页面加载时
    onMounted(() => {
      initTableData();
    });
    // 多选框选中数据
    const handleSelectionChange = (selection:Array<TableData>)=> {
      state.ids = selection.map(item => item.id)
    };
    return {
      queryRef,
      onRowDel,
      onHandleSizeChange,
      onHandleCurrentChange,
      getList,
      handleSelectionChange,
      resetQuery,
      ...toRefs(state),
    };
  },
});
</script>
