<template>
	<div class="system-post-container">
		<el-card shadow="hover">
			<div class="system-user-search mb15">
        <el-form :inline="true">
          <el-form-item label="岗位名称">
            <el-input size="default" v-model="tableData.param.postName" placeholder="请输入岗位名称" class="w-50 m-2" clearable/>
          </el-form-item>
          <el-form-item label="岗位编码">
            <el-input size="default" v-model="tableData.param.postCode" placeholder="请输入岗位编码" class="w-50 m-2" clearable/>
          </el-form-item>
          <el-form-item label="状态">
            <el-select size="default" placeholder="请选择状态" class="w-50 m-2" v-model="tableData.param.status" clearable>
              <el-option label="启用"  value="1" />
              <el-option label="禁用"  value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="postList">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddPost">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增岗位
            </el-button>
            <el-button size="default" type="danger" class="ml10" @click="onRowDel(null)">
              <el-icon>
                <ele-Delete />
              </el-icon>
              删除岗位
            </el-button>
          </el-form-item>
        </el-form>
			</div>
			<el-table :data="tableData.data" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
				<el-table-column type="index" label="序号" width="60" />
				<el-table-column prop="postCode" label="岗位编码" show-overflow-tooltip></el-table-column>
				<el-table-column prop="postName" label="岗位名称" show-overflow-tooltip></el-table-column>
				<el-table-column prop="postSort" label="排序" show-overflow-tooltip></el-table-column>
				<el-table-column prop="status" label="岗位状态" show-overflow-tooltip>
					<template #default="scope">
						<el-tag type="success" v-if="scope.row.status===1">启用</el-tag>
						<el-tag type="info" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column prop="remark" label="岗位描述" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
				<el-table-column label="操作" width="200">
					<template #default="scope">
						<el-button size="small" text type="primary" @click="onOpenEditPost(scope.row)">修改</el-button>
						<el-button size="small" text type="primary" @click="onRowDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
      <pagination
          v-show="tableData.total>0"
          :total="tableData.total"
          v-model:page="tableData.param.pageNum"
          v-model:limit="tableData.param.pageSize"
          @pagination="postList"
      />
		</el-card>
		<EditPost ref="editPostRef" @getPostList="postList"/>
	</div>
</template>

<script lang="ts">
import {toRefs, reactive, onMounted, ref, defineComponent, toRaw} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditPost from '/@/views/system/post/component/editPost.vue';
import {deletePost, getPostList} from "/@/api/system/post";
// 定义接口来定义对象的类型
interface TableData {
  postId:number;
  postCode:string;
  postName:string;
  postSort:number;
  status:number;
  remark:string;
  createdAt:string;
}
interface TableDataState {
  ids:number[];
	tableData: {
		data: Array<TableData>;
		total: number;
		loading: boolean;
		param: {
      postName:string;
      status:string;
      postCode:string;
			pageNum: number;
			pageSize: number;
		};
	};
}

export default defineComponent({
	name: 'apiV1SystemPostList',
	components: {EditPost},
	setup() {
		const addPostRef = ref();
		const editPostRef = ref();
		const state = reactive<TableDataState>({
      ids:[],
			tableData: {
				data: [],
				total: 0,
				loading: false,
				param: {
          postName:'',
          status:'',
          postCode:'',
					pageNum: 1,
					pageSize: 10,
				},
			},
		});
		// 初始化表格数据
		const initTableData = () => {
			postList()
		};
    const postList = ()=>{
      getPostList(state.tableData.param).then(res=>{
        state.tableData.data = res.data.postList??[];
        state.tableData.total = res.data.total;
      })
    };
		// 打开新增岗位弹窗
		const onOpenAddPost = () => {
      editPostRef.value.openDialog();
		};
		// 打开修改岗位弹窗
		const onOpenEditPost = (row: Object) => {
			editPostRef.value.openDialog(toRaw(row));
		};
		// 删除岗位
		const onRowDel = (row: any) => {
      let msg = '你确定要删除所选岗位？';
      let ids:number[] = [] ;
      if(row){
        msg = `此操作将永久删除岗位：“${row.postName}”，是否继续?`
        ids = [row.postId]
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
          deletePost(ids).then(()=>{
            ElMessage.success('删除成功');
            postList();
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
      state.ids = selection.map(item => item.postId)
    };
		return {
			addPostRef,
			editPostRef,
			onOpenAddPost,
			onOpenEditPost,
			onRowDel,
			onHandleSizeChange,
			onHandleCurrentChange,
      postList,
      handleSelectionChange,
			...toRefs(state),
		};
	},
});
</script>
