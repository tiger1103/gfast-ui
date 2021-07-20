<template>
  <div class="dashboard-editor-container">
    <div class="dashboard-promote">
      <el-row>
        <el-col :span="24">
          <el-card class="box-card">
              <p>领取阿里云通用云产品优惠券</p>
              <p><a target="_blank" class="text-info" href="https://www.aliyun.com/minisite/goods?userCode=fcor2omk">https://www.aliyun.com/minisite/goods?userCode=fcor2omk</a></p>
              <p>领取腾讯云通用云产品优惠券</p>
              <p><a target="_blank" class="text-info" href="https://cloud.tencent.com/act/cps/redirect?redirect=1062&cps_key=20b1c3842f74986b2894e2c5fcde7ea2&from=console">https://cloud.tencent.com/act/cps/redirect?redirect=1062&cps_key=20b1c3842f74986b2894e2c5fcde7ea2&from=console</a></p>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="other">
        <el-col :span="8">
          <el-card class="box-card kj">
            <div slot="header" class="clearfix">
              <span class="title">gfast后台管理框架</span>
            </div>
            <p>基于GF(Go Frame)的后台管理系统 ，完善的权限用户管理，致力于快速高效开发cms系统、督办系统、后续将加入流程审批、工作流引擎、项目管理、挂图作战、数据大屏等功能。</p>
            <div class="git-res">
              <el-link type="primary" icon="el-icon-cloudy" href="https://gitee.com/tiger1103/gfast" >访问码云</el-link>
              <el-link type="success" icon="el-icon-user" href="https://github.com/tiger1103/gfast">访问github</el-link>
              <el-link type="info" icon="el-icon-s-home" href="http://www.g-fast.cn">访问官网</el-link>
            </div>
            <div class="product">
              <h3>公司产品</h3>
              <ul>
                <li><a href="http://www.qjit.cn/wallchartoperation.html" target="_blank" class="text-danger">挂图作战指挥平台</a></li>
                <li><a href="http://www.qjit.cn/macrodata.html" target="_blank" class="text-danger">宏观数据库平台</a></li>
                <li><a href="http://www.qjit.cn/usedcar.html" target="_blank" class="text-danger">二手车管理系统</a></li>
                <li><a href="http://www.qjit.cn/" target="_blank" class="text-danger">公租房管理系统</a></li>
              </ul>
            </div>
          </el-card>
          <el-card class="box-card xx">
            <div slot="header" class="clearfix">
              <span class="title">联系信息</span>
            </div>
            <p><i class="el-icon-s-promotion"></i> 官网：<a href="http://www.g-fast.cn" class="text-info" target="_blank">http://www.g-fast.cn</a></p>
            <p><i class="el-icon-s-custom"></i> QQ群：865697297</p>
          </el-card>
        </el-col>
        <el-col :span="16">
          <el-card class="box-card jz">
            <div slot="header" class="clearfix">
              <span class="title">捐赠</span>
            </div>
            <p>若框架对您有帮助，您可以捐赠表达一下心意：</p>
            <img style="width: 700px; height: 360px" src="/images/jz.jpg"/>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />

    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import RaddarChart from './dashboard/RaddarChart'
import PieChart from './dashboard/PieChart'
import BarChart from './dashboard/BarChart'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}

export default {
  name: 'Index',
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>

<style lang="scss" scoped>

.dashboard-promote .el-row{
  margin-bottom: 20px;
  font-size: 14px;
}
.dashboard-promote .el-row .jz{
  height: 500px;
}
.dashboard-promote .el-row .kj{
  height: 300px;
}
.dashboard-promote .el-row .xx{
  height: 200px;
}

.git-res{
  margin-top: 20px;
}
.git-res .el-link{
  margin-right: 30px;
}

ul,li{ padding:0;margin:0;list-style:none}

.product li{
  margin-bottom: 20px;
  float: left;
  width: 150px;
}

.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
