<template>
	<div class="system-menu-container">
		<el-card shadow="hover">
			<div class="system-menu-search mb15">
        <el-form :inline="true">
          <el-form-item label="菜单名称">
            <el-input
                v-model="queryParams.title"
                placeholder="请输入菜单名称"
                clearable
                class="w-50 m-2"
                size="default"
            />
          </el-form-item>
          <el-form-item label="组件路径">
            <el-input
                v-model="queryParams.component"
                placeholder="请输入组件路径"
                clearable
                size="default"
                class="w-50 m-2"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="default" type="primary" class="ml10" @click="handleQuery">
              <el-icon>
                <ele-Search />
              </el-icon>
              查询
            </el-button>
            <el-button size="default" type="success" class="ml10" @click="onOpenAddMenu(null)" v-auth="'api/v1/system/menu/add'">
              <el-icon>
                <ele-FolderAdd />
              </el-icon>
              新增菜单
            </el-button>
          </el-form-item>
        </el-form>
			</div>
			<el-table :data="menuTableData" style="width: 100%" row-key="path" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
				<el-table-column label="菜单名称" show-overflow-tooltip>
					<template #default="scope">
						<SvgIcon :name="scope.row.icon" />
						<span class="ml10">{{ scope.row.title }}</span>
					</template>
				</el-table-column>
				<el-table-column prop="path" label="路由路径" show-overflow-tooltip></el-table-column>
				<el-table-column label="组件路径" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.component }}</span>
					</template>
				</el-table-column>
				<el-table-column label="api接口" show-overflow-tooltip>
					<template #default="scope">
						<span>{{ scope.row.name }}</span>
					</template>
				</el-table-column>
				<el-table-column label="排序" show-overflow-tooltip width="80">
					<template #default="scope">
						{{ scope.row.weigh }}
					</template>
				</el-table-column>
				<el-table-column label="类型" show-overflow-tooltip width="80">
					<template #default="scope">
						<el-tag :type="scope.row.menuType===0?'danger':(scope.row.menuType===1?'success':'warning')"
                    size="small">{{scope.row.menuType===0?'目录':(scope.row.menuType===1?'菜单':'按钮') }}</el-tag>
					</template>
				</el-table-column>
        <el-table-column prop="isHide" label="显示状态" :formatter="formatIsHide" width="120"></el-table-column>
				<el-table-column label="操作"  width="240">
					<template #default="scope">
						<el-button v-if="scope.row.menuType!==2" size="small" text type="primary" @click="onOpenAddMenu(scope.row)" v-auth="'api/v1/system/menu/add'">新增</el-button>
						<el-button size="small" text type="primary" @click="onOpenEditMenu(scope.row)" v-auth="'api/v1/system/menu/update'">修改</el-button>
						<el-button size="small" text type="primary" @click="onTabelRowDel(scope.row)" v-auth="'api/v1/system/menu/delete'">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
		<EditMenu ref="editMenuRef" @menuList="menuList" :visibleOptions="sys_show_hide" :acType="acType"/>
	</div>
</template>

<script lang="ts">
import {ref, toRefs, reactive, onBeforeMount, defineComponent, getCurrentInstance, unref} from 'vue';
import { ElMessageBox, ElMessage } from 'element-plus';
import EditMenu from '/@/views/system/menu/component/editMenu.vue';
import {delMenu, getMenuList} from "/@/api/system/menu";
export default defineComponent({
	name: 'apiV1SystemAuthMenuList',
	components: { EditMenu },
	setup() {
		const editMenuRef = ref();
		const state = reactive({
      queryParams:{
        title:"",
        component:""
      },
      menuTableData:[],
    });
    const {proxy} = getCurrentInstance() as any;
    const {sys_show_hide} = proxy.useDict('sys_show_hide')
    const acType = ref('add')
		// 打开新增菜单弹窗
		const onOpenAddMenu = (row:any) => {
      acType.value = 'add'
      editMenuRef.value.openDialog(row);
		};
		// 打开编辑菜单弹窗
		const onOpenEditMenu = (row: any) => {
      acType.value='edit'
			editMenuRef.value.openDialog(row);
		};
		// 删除当前行
		const onTabelRowDel = (row: any) => {
			ElMessageBox.confirm(`此操作将永久删除菜单：“${row.title}”, 是否继续?`, '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
          delMenu(row.id).then(()=>{
            ElMessage.success('删除成功');
            proxy.$refs['editMenuRef'].resetMenuSession()
            menuList();
          })
				})
				.catch(() => {});
		};
    const formatIsHide = (row:any)=>{
      return proxy.selectDictLabel(unref(sys_show_hide), ''+row.isHide);
    };
    onBeforeMount(()=>{
      menuList()
    });
    const handleQuery=() => {
      menuList();
    };
    const menuList = ()=>{
      getMenuList(state.queryParams).then(res=>{
        state.menuTableData = proxy.handleTree(res.data.rules??[], "id","pid");
      })
    };
		return {
			editMenuRef,
			onOpenAddMenu,
			onOpenEditMenu,
			onTabelRowDel,
      formatIsHide,
      menuList,
      handleQuery,
			...toRefs(state),
      sys_show_hide,
      acType
		};
	},
});
</script>
