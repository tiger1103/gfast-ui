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
                                    <div class="cell">linux</div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">系统架构:</div>
                                </td>
                                <td>
                                    <div class="cell">amd64</div>
                                </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">服务器名称:</div>
                              </td>
                              <td>
                                <div class="cell">DESKTOP-126SOOG</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">服务器IP:</div>
                              </td>
                              <td>
                                <div class="cell">192.168.0.11</div>
                              </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="cell">Go语言版本</div>
                                </td>
                                <td>
                                    <div class="cell">go1.16.3</div>
                                </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">启动时间</div>
                              </td>
                              <td>
                                <div class="cell">2022-04-19 08:47:54</div>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div class="cell">运行时长:</div>
                              </td>
                              <td>
                                <div class="cell">30天</div>
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
                      <tr>
                        <td>
                          <div class="cell">C:</div>
                        </td>
                        <td>
                          <div class="cell">ntfs</div>
                        </td>
                        <td>
                          <div class="cell">99.45GB</div>
                        </td>
                        <td>
                          <div class="cell">47.45GB</div>
                        </td>
                        <td>
                          <div class="cell">51.45GB</div>
                        </td>
                        <td>
                          <div class="cell">51.75%</div>
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
                                            <div class="cell">8</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">使用率:</div>
                                        </td>
                                        <td>
                                            <div class="cell">15.15%</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">Load Avg 5:</div>
                                        </td>
                                        <td>
                                            <div class="cell">0.07%</div>
                                        </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="cell">Load Avg 15:</div>
                                      </td>
                                      <td>
                                        <div class="cell">0.06%</div>
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
                                            <div class="cell">总数（GB）:</div>
                                        </td>
                                        <td>
                                            <div class="cell">200</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">已使用（GB）:</div>
                                        </td>
                                        <td>
                                            <div class="cell">63</div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="cell">剩余（GB）:</div>
                                        </td>
                                        <td>
                                            <div class="cell">137</div>
                                        </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <div class="cell">本系统使用（MB）:</div>
                                      </td>
                                      <td>
                                        <div class="cell">87</div>
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
	import { toRefs, reactive, onMounted, getCurrentInstance } from 'vue';
	import * as echarts from 'echarts';
	import 'echarts-wordcloud';

	export default {
		name: 'index',
		components: {},
		setup() {
			const { proxy } = getCurrentInstance() as any;
			const state: any = reactive({
				myCharts: [],
			});
			//CPU
			const initChartCPU = () => {
				const myChart1 = echarts.init(proxy.$refs.chartsWarningRef1);
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
							data: [
								{
									value: 15,
									name: 'CPU使用率',
								},
							],
						},
					],
				};
				myChart1.setOption(option);
				state.myCharts.push(myChart1);
			};
			//内存
			const initChartRAM = () => {
				const myChart2 = echarts.init(proxy.$refs.chartsWarningRef2);
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
							data: [
								{
									value: 30,
									name: '内存使用率',
								},
							],
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
			return {
				...toRefs(state),
			};
		},
	};
</script>

<style scoped lang="scss">
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

