<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <span>Gfast 安装向导</span>
      </div>
    </template>
    <div class="content">
      <h1>恭喜您, 安装完成！</h1>
      <p>..........................................</p>
    </div>
    <div class="foot"><el-button type="primary" @click="accept">进入后台</el-button></div>
  </el-card>
</template>

<script>
export default {
  name: "finish",
  methods:{
    accept() {
      this.$router.push({path:"/"})
    }
  }
}
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
