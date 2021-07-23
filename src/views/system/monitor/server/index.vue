<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span>CPU</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell">属性</div></th>
                  <th class="is-leaf"><div class="cell">值</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="cell">核心数</div></td>
                  <td><div class="cell" v-if="server.cpuNum">{{ server.cpuNum }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">cpu使用率</div></td>
                  <td><div class="cell" v-if="server.cpuUsed">{{ server.cpuUsed }}%</div></td>
                </tr>
                <tr>
                  <td><div class="cell">Load Avg 5</div></td>
                  <td><div class="cell" v-if="server.cpuAvg5">{{ server.cpuAvg5 }}%</div></td>
                </tr>
                <tr>
                  <td><div class="cell">Load Avg 15</div></td>
                  <td><div class="cell" v-if="server.cpuAvg15">{{ server.cpuAvg15 }}%</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header"><span>内存</span></div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell">属性</div></th>
                  <th class="is-leaf"><div class="cell">服务器内存</div></th>
                  <th class="is-leaf"><div class="cell">本系统使用内存</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><div class="cell">总内存</div></td>
                  <td><div class="cell" v-if="server.memTotal">{{ memorySizeFormat(server.memTotal) }}</div></td>
                  <td><div class="cell" v-if="server.goTotal">{{ memorySizeFormat(server.goTotal) }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">已用内存</div></td>
                  <td><div class="cell" v-if="server.memUsed">{{ memorySizeFormat(server.memUsed)}}</div></td>
                  <td><div class="cell" v-if="server.goUsed">{{ memorySizeFormat(server.goUsed)}}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">剩余内存</div></td>
                  <td><div class="cell" v-if="server.memFree">{{ memorySizeFormat(server.memFree) }}</div></td>
                  <td><div class="cell" v-if="server.goFree">{{ memorySizeFormat(server.goFree) }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">使用率</div></td>
                  <td><div class="cell" v-if="server.memUsage" :class="{'text-danger': server.memUsage > 80}">{{ server.memUsage }}%</div></td>
                  <td><div class="cell" v-if="server.jvm" :class="{'text-danger': server.goUsage > 80}">{{ server.goUsage }}%</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>服务器信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <tbody>
                <tr>
                  <td><div class="cell">服务器名称</div></td>
                  <td><div class="cell" v-if="server.sysComputerName">{{ server.sysComputerName }}</div></td>
                  <td><div class="cell">操作系统</div></td>
                  <td><div class="cell" v-if="server.sysOsName">{{ server.sysOsName }}</div></td>
                </tr>
                <tr>
                  <td><div class="cell">服务器IP</div></td>
                  <td><div class="cell" v-if="server.sysComputerIp">{{ server.sysComputerIp }}</div></td>
                  <td><div class="cell">系统架构</div></td>
                  <td><div class="cell" v-if="server.sysOsArch">{{ server.sysOsArch }}</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

     <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>GO信息</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <tbody>

                <tr>
                  <td><div class="cell">语言环境</div></td>
                  <td><div class="cell" v-if="server.goName">{{ server.goName }}</div></td>
                  <td><div class="cell">启动时间</div></td>
                  <td><div class="cell" v-if="server.goStartTime">{{ server.goStartTime }}</div></td>
                </tr>

                <tr>
                  <td><div class="cell">安装路径</div></td>
                  <td><div class="cell" v-if="server.goHome">{{ server.goHome }}</div></td>
                  <td><div class="cell">项目路径</div></td>
                  <td><div class="cell" v-if="server.goUserDir">{{ server.goUserDir }}</div></td>
                </tr>


                <tr>
                  <td><div class="cell">版本</div></td>
                  <td><div class="cell" v-if="server.goVersion">{{ server.goVersion }}</div></td>
                  <td><div class="cell">运行时长</div></td>
                  <td><div class="cell" v-if="server.goRunTime">{{ timeFormat(server.goRunTime) }}</div></td>
                </tr>

              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span>磁盘状态</span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="is-leaf"><div class="cell">盘符路径</div></th>
                  <th class="is-leaf"><div class="cell">文件系统</div></th>
                  <th class="is-leaf"><div class="cell">总大小</div></th>

                  <th class="is-leaf"><div class="cell">可用大小</div></th>
                  <th class="is-leaf"><div class="cell">已用大小</div></th>
                  <th class="is-leaf"><div class="cell">已用百分比</div></th>
                </tr>
              </thead>
              <tbody v-if="server.diskList">
                <tr v-for="(sysFile,index) in server.diskList" :key="index">
                  <td><div class="cell">{{ sysFile.path }}</div></td>
                  <td><div class="cell">{{ sysFile.fstype }}</div></td>
                  <td><div class="cell">{{ memorySizeFormat(sysFile.total) }}</div></td>

                  <td><div class="cell">{{ memorySizeFormat(sysFile.free) }}</div></td>
                  <td><div class="cell">{{ memorySizeFormat(sysFile.used) }}</div></td>
                  <td><div class="cell" :class="{'text-danger': sysFile.usedPercent > 80}">{{ sysFile.usedPercent }}%</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getServer } from "@/api/monitor/server";

export default {
  name: "Server",
  data() {
    return {
      // 加载层信息
      loading: [],
      // 服务器信息
      server: [],
      runTag:null,
    };
  },
  created() {
    this.getList();
    this.runTag = setInterval(this.getList,5000);
    this.openLoading();
  },
  deactivated(){
    clearInterval(this.runTag)
    this.runTag = null
  },
  activated(){
    if(!this.runTag){
      this.runTag = setInterval(this.getList,5000);
    }
  },
  destroyed(){
    clearInterval(this.runTag)
    this.runTag = null
  },
  methods: {
    /** 查询服务器信息 */
    getList() {
      getServer().then(response => {
        this.server = response.data;
        this.loading.close();
      });
    },
    // 打开加载层
    openLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "拼命读取中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    memorySizeFormat(size){
      size  = parseFloat(size);
      let rank =0;
      let rankchar ='Bytes';
      while(size>1024&&rankchar!='GB'){
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
        }
      }
      return size.toFixed(2)+ " "+ rankchar;
    },
    timeFormat(second){
      second = parseFloat(second)
      let rank = 0
      let rankchar = '秒'
      while(second>60&&rankchar!='小时'){
        second = second/60;
        rank++
        if(rank==1){
          rankchar = '分'
        }else if(rank==2){
          rankchar='小时'
        }
      }
      return second.toFixed(2)+" "+rankchar
    }
  }
};
</script>
