<template>
    <div class="system-user-container">
        <el-row :gutter="30">
            <el-col :xs="24" :sm="12" :md="12" class="marg-b-15">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>运行资源</span>
                        </div>
                    </template>
                    <div class=" el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%;">
                            <tbody>
                            <tr>
                                <td>
                                    <div class="cell">操作系统:</div>
                                </td>
                                <td>
                                    <div class="cell">{{sysInfo.sysOsName}}</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">系统架构:</div>
                                </td>
                                <td>
                                    <div class="cell">{{sysInfo.sysOsArch}}</div>
                                </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">服务器名称:</div>
                              </td>
                              <td>
                                <div class="cell">{{sysInfo.sysComputerName}}</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">服务器IP:</div>
                              </td>
                              <td>
                                <div class="cell">{{sysInfo.sysComputerIp}}</div>
                              </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">Go语言版本</div>
                                </td>
                                <td>
                                    <div class="cell">{{sysInfo.goVersion}}</div>
                                </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">启动时间</div>
                              </td>
                              <td>
                                <div class="cell">{{sysInfo.goStartTime}}</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">运行时长:</div>
                              </td>
                              <td>
                                <div class="cell">{{timeFormat(sysInfo.goRunTime)}}</div>
                              </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" class="marg-b-15">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>硬盘资源</span>
                        </div>
                    </template>
                  <div class=" el-table--enable-row-hover el-table--medium">
                    <table cellspacing="0" style="width: 100%;">
                      <tbody>
                      <tr>
                        <td>
                          <div class="cell">盘符路径</div>
                        </td>
                        <td>
                          <div class="cell">文件系统</div>
                        </td>
                        <td>
                          <div class="cell">总大小</div>
                        </td>
                        <td>
                          <div class="cell">可用大小</div>
                        </td>
                        <td>
                          <div class="cell">已用大小</div>
                        </td>
                        <td>
                          <div class="cell">已用百分比</div>
                        </td>
                      </tr>
                      <tr v-for="(sysFile, index) in sysInfo.diskList" :key="index">
                        <td>
                          <div class="cell">{{ sysFile.path }}</div>
                        </td>
                        <td>
                          <div class="cell">{{ sysFile.fstype }}</div>
                        </td>
                        <td>
                          <div class="cell">{{ memorySizeFormat(sysFile.total) }}</div>
                        </td>
                        <td>
                          <div class="cell">{{ memorySizeFormat(sysFile.free) }}</div>
                        </td>
                        <td>
                          <div class="cell">{{ memorySizeFormat(sysFile.used) }}</div>
                        </td>
                        <td>
                          <div class="cell">{{ sysFile.usedPercent }}%</div>
                        </td>
                      </tr>
                      </tbody>
                    </table>

                  </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" class="marg-b-15">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>CPU</span>
                        </div>
                    </template>
                    <div class=" el-table--enable-row-hover el-table--medium">
                        <el-row :gutter="30">
                            <el-col :xs="24" :sm="24" :md="12">
                                <table cellspacing="0" style="width: 100%;">
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div class="cell">核心数:</div>
                                        </td>
                                        <td>
                                            <div class="cell">{{sysInfo.cpuNum}}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">使用率:</div>
                                        </td>
                                        <td>
                                            <div class="cell">{{sysInfo.cpuUsed}}%</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">Load Avg 5:</div>
                                        </td>
                                        <td>
                                            <div class="cell">{{sysInfo.cpuAvg5}}%</div>
                                        </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="cell">Load Avg 15:</div>
                                      </td>
                                      <td>
                                        <div class="cell">{{sysInfo.cpuAvg15}}%</div>
                                      </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12">
                                <div style="min-height: 280px;" ref="chartsWarningRef1"></div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" class="marg-b-15">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>内存</span>
                        </div>
                    </template>
                    <div class=" el-table--enable-row-hover el-table--medium">
                        <el-row :gutter="30">
                            <el-col :xs="24" :sm="24" :md="12">
                                <table cellspacing="0" style="width: 100%;">
                                    <tbody>
                                    <tr>
                                        <td>
                                            <div class="cell">总数:</div>
                                        </td>
                                        <td>
                                            <div class="cell">{{ memorySizeFormat(sysInfo.memTotal) }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">已使用:</div>
                                        </td>
                                        <td>
                                            <div class="cell">{{ memorySizeFormat(sysInfo.memUsed)}}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">剩余:</div>
                                        </td>
                                        <td>
                                            <div class="cell">{{ memorySizeFormat(sysInfo.memFree) }}</div>
                                        </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="cell">GFast系统使用:</div>
                                      </td>
                                      <td>
                                        <div class="cell">{{ memorySizeFormat(sysInfo.goUsed)}}</div>
                                      </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </el-col>
                            <el-col :xs="24" :sm="24" :md="12">
                                <div style="min-height: 280px;" ref="chartsWarningRef2"></div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script lang="ts">
	import { toRefs, reactive, onMounted, getCurrentInstance, defineComponent  } from 'vue';
	import * as echarts from 'echarts';
	import 'echarts-wordcloud';
  import { getSysInfo } from "/@/api/system/monitor/server";
  let interval: any = null
	export default defineComponent({
		name: 'monitor',
		components: {},
		setup() {
			const { proxy } = getCurrentInstance() as any;
			const state: any = reactive({
				myCharts: [],
        sysInfo:{}
			});


      let myChart1: any;
      let myChart2: any;
      function setOptChart1 (value:number) {
        myChart1.setOption({
          series: [
            {
              data: [{
                value: value,
                name: 'CPU使用率',
              }],
            },
          ],
        })
      }

      function setOptChart2 (value:number) {
        myChart2.setOption({
          series: [
            {
              data: [{
                value: value,
                name: '内存使用率',
              }],
            },
          ],
        })
      }

			//CPU
			const initChartCPU = () => {
        myChart1 = echarts.init(proxy.$refs.chartsWarningRef1);
				const option = {
					tooltip: {
						formatter: '{a} <br/>{b} : {c}%',
					},
					series: [
						{
							type: 'gauge',
							name: 'CPU',
							radius: '80%', //修改表盘大小
							title: {
								'show': true,             		//控制表盘title(今日预计用电量)字体是否显示
								'fontSize': 14,           		//控制表盘title(今日预计用电量)字体大小
								// 'color': 'red',           		//控制表盘title(今日预计用电量)字体颜色
								'offsetCenter': [0, '40%'],    //设置表盘title(今日预计用电量)位置
							},
							axisLine: {
								show: true,
								lineStyle: { // 属性lineStyle控制线条样式
									color: [
										[0.3, '#4dabf7'],
										[0.6, '#69db7c'],
										[0.8, '#ffa94d'],
										[1, '#ff6b6b'],
									],
								},
							},
							detail: {
								valueAnimation: true,
								formatter: '{value}%',
								textStyle: {
									fontSize: 36,
									color: 'red',
								},
								offsetCenter: ['0', '80%'],    //表盘数据(30%)位置
							},
							// data: [
							// 	{
							// 		value: 15,
							// 		name: 'CPU使用率',
							// 	},
							// ],
						},
					],
				};
				myChart1.setOption(option);
				state.myCharts.push(myChart1);
			};

			//内存
			const initChartRAM = () => {
        myChart2 = echarts.init(proxy.$refs.chartsWarningRef2);
				const option = {
					tooltip: {
						formatter: '{a} <br/>{b} : {c}%',
					},
					series: [
						{
							type: 'gauge',
							name: '内存',
							radius: '80%', //修改表盘大小
							title: {
								'show': true,             		//控制表盘title(今日预计用电量)字体是否显示
								'fontSize': 14,           		//控制表盘title(今日预计用电量)字体大小
								// 'color': 'red',           		//控制表盘title(今日预计用电量)字体颜色
								'offsetCenter': [0, '40%'],    //设置表盘title(今日预计用电量)位置
							},
							axisLine: {
								show: true,
								lineStyle: { // 属性lineStyle控制线条样式
									color: [
										[0.3, '#4dabf7'],
										[0.6, '#69db7c'],
										[0.8, '#ffa94d'],
										[1, '#ff6b6b'],
									],
								},
							},
							detail: {
								valueAnimation: true,
								formatter: '{value}%',
								textStyle: {
									fontSize: 36,
									color: 'red',
								},
								offsetCenter: ['0', '80%'],    //表盘数据(30%)位置
							},
							// data: [
							// 	{
							// 		value: 30,
							// 		name: '内存使用率',
							// 	},
							// ],
						},
					],
				};
				myChart2.setOption(option);
				state.myCharts.push(myChart2);
			};


			// 页面加载时
			onMounted(() => {
				initChartCPU();
				initChartRAM();
			});


      function getSystemInfo() {
       getSysInfo().then((res:any)=>{
          const {code , data} = res
          if(code === 0) {
            state.sysInfo = data
            setOptChart1(data.cpuUsed)
            setOptChart2(data.memUsage)
          }
        })
      }

			return {
				...toRefs(state),
        getSystemInfo,
        setOptChart1,
        setOptChart2,
			};
		},
    created() {
      this.getSystemInfo()
      if (interval === null) {
        interval = setInterval(()=> {
          this.getSystemInfo()
        }, 5000)
      }
    },
    unmounted() {
      if (interval !== null) {
        clearInterval(interval)
        interval = null
      }
    },
    data() {
      return {}
    },
    methods:{
      memorySizeFormat(size:any){
        size  = parseFloat(size);
        let rank =0;
        let rankchar ='Bytes';
        while(size>1024&&rankchar!='TB'){
          size = size/1024;
          rank++;
          if(rank==1){
            rankchar="KB";
          }
          else if(rank==2){
            rankchar="MB";
          }
          else if(rank==3){
            rankchar="GB";
          }else if(rank==4){
            rankchar="TB";
          }
        }
        return size.toFixed(2)+ " "+ rankchar;
      },
      timeFormat(second:any){
        second = parseFloat(second)
        let rank = 0
        let rankchar = '秒'
        while((second>60&&rankchar!='小时'&&rankchar!='天')||(second>24&&rankchar=='小时')){
          if(rankchar=='小时'){
            second = second/24;
          }else{
            second = second/60;
          }
          rank++
          if(rank==1){
            rankchar = '分'
          }else if(rank==2){
            rankchar='小时'
          }else if(rank==3){
            rankchar='天'
          }
        }
        return second.toFixed(2)+" "+rankchar
      }
    }
  });
</script>

<style scoped lang="scss">
    .el-card{
      height:300px;
      overflow-y: auto;
    }
    .system-user-container {
    }

    .marg-b-15 {
        margin-bottom: 15px;
    }

    .cell {
        box-sizing: border-box;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal;
        word-break: break-all;
        line-height: 36px;
        padding-left: 10px;
        padding-right: 10px;
    }

    .box-card {
        min-height: 372px;
    }
</style>

