<template>
  <ul class="step">
    <li :class="['number', {'active':  number >= 1}]"><span>1</span><em>检测环境</em></li>
    <li :class="['number', {'active':  number >= 2}]"><span>2</span><em>创建数据</em></li>
    <li :class="['number', {'active':  number >= 3}]"><span>3</span><em>完成安装</em></li>
  </ul>
</template>

<script lang="ts">
export default {
  name: "step",
  props:{
    number:{
      type:Number,
      default: 1,
    }
  }
}
</script>

<style scoped lang="scss">
.step {
  list-style-type:none;
  display: flex;
  justify-content:space-around;
  .active {
    span{
      background-color:#409EFF !important;
    }
    em{
      font-weight: bold;
    }
  }
  .number {
    height:40px;
    line-height:40px;
    span {
      margin-right:10px;
      display:inline-block;
      width:20px;
      height:20px;
      line-height: 20px;
      text-align: center;
      background-color:#E4E7ED;
      color:#fff;
      border-radius: 50%;
    }
    em{

    }

  }
}
</style>
