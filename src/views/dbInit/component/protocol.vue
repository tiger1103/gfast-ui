<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Gfast 安装向导</span>
      </div>
    </template>
    <div class="content">
      <p>Gfast 软件使用协议</p>
      <h3>免责声明：</h3>
      <p>1、Gfast仅限自己学习使用，一切商业行为与Gfast无关。</p>
      <p>2、用户不得利用Gfast从事非法行为，用户应当合法合规的使用，发现用户在使用产品时有任何的非法行为，Gfast有权配合有关机关进行调查或向政府部门举报，Gfast不承担用户因非法行为造成的任何法律责任，一切法律责任由用户自行承担，如因用户使用造成第三方损害的，用户应当依法予以赔偿。</p>
      <p>3、所有与使用Gfast相关的资源直接风险均由用户承担。</p>

      <h3>商用说明</h3>
      <p>商用注意事项</p>
      <p>如果您将此项目用于商业用途，请遵守Apache2.0协议并保留作者技术支持声明。</p>
      <p>● GFast快速开发平台采用Apache-2.0技术协议</p>
      <p>● 二次开发如用于商业性质或开源竞品请保留版权信息</p>
      <p>● 允许进行商用，但是不允许二次开源出来并进行收费</p>
      <p>● 请不要删除和修改GFast源码头部的版权与作者声明及出处，若需修改或删除联系群主授权</p>
      <p>● 不得进行简单修改包装声称是自己的项目</p>
      <p>● 我们已经申请了相关的软件开发著作权和相关登记</p>
      <p>● 如果您在自己的项目中使用了我们项目中的扩展或模块，请在项目介绍中，进行明确说明</p>
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
