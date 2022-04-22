<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Gfast 安装向导</span>
      </div>
    </template>
    <div class="content">
      <p>Gfast 软件使用协议</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
      <p>版权所有: .......................................</p>
    </div>
    <div class="foot"><el-button type="primary" @click="accept">接 受</el-button></div>
  </el-card>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import { inject } from 'vue'
export default defineComponent({
  name: "protocol",
  setup(){
    const jump:any = inject('jump')
    return {
      jump
    }
  },
  methods:{
    accept() {
      this.jump('CheckEnv')
    }
  }
})
</script>

<style scoped lang="scss">
.box-card{
  margin:100px auto;
  width:500px;
  height:520px;
  .content {
    height:370px;
    border: 1px #E4E7ED solid;
    margin-bottom:10px;
    padding:10px;
    background-color:#F2F6FC;
    overflow: auto;
  }
  .foot {
    text-align:center;
  }
}

</style>
