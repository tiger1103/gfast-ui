<template>
	<div class="system-dic-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
        <el-form :model="tableData.param" ref="queryRef" :inline="true" label-width="68px">
          <el-form-item label="字典名称" prop="dictName">
            <el-input
                v-model="tableData.param.dictName"
                placeholder="请输入字典名称"
                clearable
                size="default"
                style="width: 240px"
                @keyup.enter.native="typeList"
            />
          </el-form-item>
          <el-form-item label="字典类型" prop="dictType">
            <el-input
                v-model="tableData.param.dictType"
                placeholder="请输入字典类型"
                clearable
                size="default"
                style="width: 240px"
                @keyup.enter.native="typeList"
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
          <el-form-item label="创建时间" prop="dateRange">
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
            <el-button size="default" type="primary" class="ml10" @click="typeList">
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
        <el-table-column label="字典ID" align="center" prop="dictId" width="120"/>
        <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
        <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
          <template #default="scope">
            <router-link :to="'/system/dict/data/list/' + scope.row.dictType" class="link-type">
              <span>{{ scope.row.dictType }}</span>
            </router-link>
          </template>
        </el-table-column>
				<el-table-column prop="status" label="字典状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="字典描述" show-overflow-tooltip></el-table-column>
				<el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip width="180"></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditDic(scope.row)">修改</el-button>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="typeList"
      />
		</el-card>
		<EditDic ref="editDicRef" @typeList="typeList"/>
	</div>
</template>

<script lang="ts">
import { toRefs, reactive, onMounted, ref, defineComponent } from 'vue';
import { ElMessageBox, ElMessage,FormInstance} from 'element-plus';
import EditDic from '/@/views/system/dict/component/editDic.vue';
import {deleteType, getTypeList} from "/@/api/system/dict/type";


// 定义接口来定义对象的类型
interface TableDataRow {
  dictId:number;
  dictName: string;
  dictType: string;
  status: number;
  remark:string;
  createdAt:string;
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
      dictName: string;
      dictType: string;
      status: string;
      dateRange:string[];
		};
	};
}

export default defineComponent({
	name: 'systemDic',
	components: { EditDic },
	setup() {
		const addDicRef = ref();
		const editDicRef = ref();
    const queryRef = ref();
		const state = reactive<TableDataState>({
      ids:[],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
					pageNum: 1,
					pageSize: 10,
          dictName:'',
          dictType:'',
          status:'',
          dateRange:[],
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
      typeList()
		};
    const typeList=()=>{
      getTypeList(state.tableData.param).then((res:any)=>{
        state.tableData.data = res.data.dictTypeList;
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
        msg = `此操作将永久删除用户：“${row.dictName}”，是否继续?`
        ids = [row.dictId]
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
          deleteType(ids).then(()=>{
            ElMessage.success('删除成功');
            typeList();
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
      typeList()
    };
    // 多选框选中数据
    const handleSelectionChange = (selection:TableDataRow[])=> {
      state.ids = selection.map(item => item.dictId)
    };
		return {
			addDicRef,
			editDicRef,
      queryRef,
			onOpenAddDic,
			onOpenEditDic,
			onRowDel,
      typeList,
      resetQuery,
      handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
