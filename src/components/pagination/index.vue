<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
        :background="background"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :layout="layout"
        :page-sizes="pageSizes"
        :pager-count="pagerCount"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
    />
  </div>
</template>

<script lang="ts">
import { toRefs, defineComponent,computed } from 'vue';
const props = {
  total: {
    required: true,
    type: Number
  },
  page: {
    type: Number,
    default: 1
  },
  limit: {
    type: Number,
    default: 20
  },
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  // 移动端页码按钮的数量端默认值5
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  background: {
    type: Boolean,
    default: true
  },
  hidden: {
    type: Boolean,
    default: false
  }
};
export default defineComponent({
  name: 'pagination',
  props: props,
  setup(props,{emit}){
    const { page,limit,pageSizes } = toRefs(props);
    const currentPage = computed({
      get() {
        return page.value;
      },
      set(val) {
        emit('update:page', val)
      }
    });
    const pageSize = computed({
      get() {
        return limit.value
      },
      set(val) {
        emit('update:limit', val)
      }
    });
    const handleSizeChange = (val:number) => {
      emit('pagination', { page: currentPage.value, limit: val })
    };
    const handleCurrentChange=(val:number) => {
      emit('pagination', { page: val, limit: pageSizes.value })
    }
    return {
      currentPage,
      pageSize,
      handleSizeChange,
      handleCurrentChange
    }
  }
});
</script>

<style scoped lang="scss">
.pagination-container {
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
