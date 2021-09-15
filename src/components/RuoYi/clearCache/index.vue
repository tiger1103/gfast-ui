<template>
  <div>
    <i class="el-icon-delete-solid" @click="handleClearCache"/>
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
  name: 'clearCache',
  data() {
    return {

    }
  },
  methods: {
    handleClearCache(){
      request({
          url: '/system/cache/clear',
          method: 'delete'
        }).then(res=>{
          this.msgSuccess(res.data)
        })
      }
    }
}
</script>
