<template>
    <div class="flow-layout">
      <div class="flow-toolbar">
        <h3 class="title-head">功能栏</h3>
        <el-row class="tool-btn">
          <el-button type="success" plain @click="saveProcess">保存设计</el-button>
          <el-button type="primary" plain @click="addProcess">新增步骤</el-button>
          <el-button type="warning" plain @click="checkFlow">逻辑检查</el-button>
          <el-button type="danger" plain @click="clearAllNodes" >清空步骤</el-button>
          <el-button plain @click="wfRefresh">刷新设计</el-button>
        </el-row>
      </div>
      <div class="flow-design">
        <h3 class="title-head">流程设计栏</h3>
        <div class="flow-editor">
            <!--zoom-->
            <div class="flow-zoom" :data-zoom="canvasDataRoom + '%'">
                <div class="zoom-btn">
                    <el-button size="mini" :class="{'el-button--primary':canvasRoomMinusEnable}" icon="el-icon-minus"
                               circle
                               @click="handleMinusCanvas"></el-button>
                </div>
                <div class="zoom-btn">
                    <el-button size="mini" :class="{'el-button--primary':canvasRoomPlusEnable}" icon="el-icon-plus"
                               circle
                               @click="handlePlusCanvas"></el-button>
                </div>
            </div>
            <!--    canvas   -->
            <div class="canvas-container" :data-zoom="canvasDataRoom">
                <div id="campaignCanvas" :style="canvasRoomScaleStyle" ref="campaignCanvas">
                  <template v-for="(row,index) in processListTmp">
                    <div :id="'window'+row.id" :style="row.style+'text-align: left;'" :process_to="row.process_to" :process_id="row.id"
                         class="process-step wf_btn ui-draggable ui-droppable" @dblclick="deleteNode(row.id)" @mousedown="clk=true" @click="showAttr(row.id)" :key="row.id">
                      <span :id="'flag'+row.id" class="process-flag" style="text-align: left;">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfbBRIXBAD72CbZAAADCElEQVQ4y13US2xVZRSG4effe7elFGhpoVWgUArtQe5XkUg0BC8hkagQExPjAAIDB4wcOXFg4tihA2Vk1IEaBt5RxEaDYmtTqglIa0hpS1qIRWiF9pzu8zvoCRi/2cq6fMmbtVZQ0UGoVbDDPgUrBCMGdPklXtp751WZALJKKaxzxBOxPaSVuFOnA4bCmdmPs4szN09rskNWSdY57FjcVhOabUlXpU2BiTicX8jH1jR2HHp28puBN9PhkTkH1HnFidi0NjxVtTtbGKoqU0pVU7FvtikptDu+suHaib03SA/CS15LFj+SHqvZldWGVMkd0xLVasPqtCUJ8tDd9snohp5haYG1Xrd2T3K0ZkUaRcGfTjlvvmUiAnpnT8axpd/97Eai2svl7e1erG5Joku63HXHkCtuyZ3Tq4wHksXRNkfVZtY5UJPuz9pSBp1y3aQmqUTJDz5TJ7HViuTpqqFi8UkfZLbFjua4J4OoqKRLs5Kgx5S7MmUBu7LPi1fa7E7sC+nGtD6ZA/+C5WaMmBGNmdTokB1gYdicCvZlNtORVqHPNdE8iVjBGtQa94VGO2U6UiVbMi3UB+jRLUgl7mvUVbmCLTKLAlqy+8kFGiVm3b3nwHzVcosqezS3S+MW3orwqI1mnDPwH4elHrPAfNW4HTGe6GcwL6FVwd9GlAUBQTRuXLt2iVmDOfoTXTH/LZ/z+N3XpjTYoFai04Omfa9HxGS8kIvOJn4NA9fDTyVYbo0Gz9gpKFvvOc1WahPQPTvKkPOZS76cWXfGprQtbfa8CQX9FagbzFOtFSPl06VpybcupoXcSNh1c/mtcke6INRZIigJlum0RKN6/FX+sNhbDn3ecC0tMIE9ozXXy61JQwL1HrLJkgqp4fJ7Mz/m5X+85SvSywoMyOPm4drBnMYkC0mFe8lkPDf7frE3xtve9q7ip0Llpuscdjxur4kttqat6dLARLya9+VjpkO44B0fmeJ+A6x3xP64+t4TgLKrzjpZ4TDX8L8387DHdVolGHHZWd3+mJs9p38BQHkS326FepQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDYtMjhUMjI6Mzg6MjQrMDg6MDCBECHGAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDExLTA1LTE4VDIzOjA0OjAwKzA4OjAwRsh68wAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAXdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADMyKPT49AAAABZ0RVh0VGh1bWI6OkltYWdlOjpXaWR0aAAzMtBbOHkAAAAZdEVYdFRodW1iOjpNaW1ldHlwZQBpbWFnZS9wbmc/slZOAAAAF3RFWHRUaHVtYjo6TVRpbWUAMTMwNTczMTA0MJzV/YIAAAARdEVYdFRodW1iOjpTaXplADEzMzhCRu5XfwAAAGB0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9uZXdzaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9zcmMvNTA0Ny81MDQ3NTMucG5nxUdQRAAAAABJRU5ErkJggg==" width="18px">
                      </span>&nbsp;<span v-html="row.process_name"></span><br>
                      <img src="data:image/png;base64,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eJWkknqeCfn8YZt9h27yjSowQmiHpKBpTZtzGCy7U18ibfIBwTI69UfaJx6DFiPW/xb/b/gP8zuk/2nab5kAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDEtMDlUMDM6NTg6MTMrMDg6MDA5NyEdAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA5VDAzOjU4OjEzKzA4OjAwSGqZoQAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAABjdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIM5IkAsAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADU1MXLoxz8AAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgANTUx4RmXYgAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTc3NDkzmyKPKAAAABJ0RVh0VGh1bWI6OlNpemUAMzE4NjFCZKk/ngAAAGJ0RVh0VGh1bWI6OlVSSQBmaWxlOi8vL2hvbWUvd3d3cm9vdC9uZXdzaXRlL3d3dy5lYXN5aWNvbi5uZXQvY2RuLWltZy5lYXN5aWNvbi5jbi9maWxlcy8xMjAvMTIwMTMzNy5wbmfCdaGGAAAAAElFTkSuQmCC" width="18px">&nbsp;<span v-html="row.mode"></span><br>
                      <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAxCAYAAACcXioiAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAD9AAAA/QCVfLMFAAAAB3RJTUUH4wEJAzcWevkOigAABRFJREFUaN7N2mmoVVUUB/DfUx9laaXNIRGVaVHUS3vSZJQRkUhzFg00CFGZUV8qkigriqBIKaPpQ0WQDahpHyKTRtMnZfNoijaYCmVmmaXPPqx95XA69/nuufe+14LLhXPu3vv/33udtf5rnduiwXbdxEld3n/k4WkNXa+lycBb0/c/zSJTN4Ec8L4YjhNxNPZL11bjU7yDj7GpUSTqIpADfziux1kYgFUJ+Fbskch0Yh4ewruNIFGaQAZ8C8bjXuyKF/AivsBvicAAHIxxuBT9cTcekdyrLIm+dYKHK/EwvsMEPIpl2JDAbcaf+AFv4HUMxdX4G+9ja3v7KIs7FtWMpV/ZE0h2Ku5HRwK/onIjv6MZ0p/hikR6Mr7GzLIAanahDJDBmI29cSa+rAa+YCzsjzniFMZiTVdjq1mfsszTosfgge6Ar9zL3F+JB3EETi8LoiyBVpwjfH12d8BXsdeE241V8nksS2BPHIkF+LlW8JnfrsGHIgQPYvuZvC4Cmcn3SAt+Wcv4AuvE8jTf4DITlDmBVlyI3bCeurPpqkRgctqUphMYgWswA6+WRZ0h/TymiWQ4uicIDMWOeAI/lSWQsbUic28RcqPpBLYI30XD5PFOQnKs6wkCa9P3XtQeNarYIWlTvu8JAivwO0ZWLpQhkRnTD2PwI77tCQIrReweJ+J3PdaKy0UmniPkd9MJ/IXHhAs9jQOp7RQyvx0tpMhHac6arWwmnoMbcJgQcmXtDCHmJmIpTRZzmck7hQT+SGiiXejeKWR+s7vw/Q5R/JSymk8gQ2K9iN8jcEKJtY/DMMyVauQyIbkeOQ2zxIM3ATvQ9Slk7rWK0nK1UKSlrZSEXdyxSHv7KPhVhMEJIgwugaLyMEfsPNyEqXiF8gmx3hOAp7AQd4gC5z+Ac+APw13C75+sd/HSBDI7tk4oyRZR0B9dBTi04XGhOicrWUY2hEDOFmIS9hXq8vgCEseKh/4g0T+a14iF6yKQ27mZuFiE1GsL5r5AFC2XCileNEfPEiiwb0Q/qMi2pE/NcqFpBHI+vjNuxRBR6HTmfj5XhM+7hasVzVGz1dMXytqhuB3nigf5FmwkXCSN6Suek3uwGLfhPVEHbLNaXapbBKqA3kn0O88UeWCgEGZTJTeqgMlJ54sxRfRLn8VzIqT+kV+gO2S6JFAAfKBop5ySPkeIDDw/gX+7sqNdtBalcTfi7IThE9E3nS/a7+u7S6SQQAHwIaJtPh5HiYbtF3hTNGs7RAO3ywVz87aKvHCGEHWHpxP6BC8LmbJse0RatrPIbrhMdCEOSLszS8TwrxREnO4ce8EGDRDCboxwyTbRMHtSZPrV1eZv6WLio3AfThYvI6aLY15XBnQ3iRB55ETRfj8NH+BmVV6ItFSZ7CSR8ncVYe8ZNfhlg8j0x/lCY+0gip5tbfjK+kXvB0aKY9ssfP6tZgLPz5shsjFt3OdpM6fjlzyeltygwUKvDE/gG/Ieq4zlTqQt4VorgsnqCqZ8Jr5ICLEpvQm+YM0luDMRuSR7I0tgkGhxLBaKstfAV1l7pmjnXyLq6SCQOaoRotiYId4u9ir4AhIb8JLo4rURbpY9gRHireKC3gbdhS1KGNsqF7JRaJjo1S+vXGhQ37ORtkJUcUPzBPoInbMLrhLdt4b9j6JBtlXkhoFCIfRBZ5bAUuwjep7/N/BZEkuFRuqbJbBZZLxGV2jNsk7pLwrZZ2BTubl61/4FsR6JKpzlaNkAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDEtMDlUMDM6NTU6MjIrMDg6MDDkMab6AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTAxLTA5VDAzOjU1OjIyKzA4OjAwlWweRgAAAEN0RVh0c29mdHdhcmUAL3Vzci9sb2NhbC9pbWFnZW1hZ2ljay9zaGFyZS9kb2MvSW1hZ2VNYWdpY2stNy8vaW5kZXguaHRtbL21eQoAAABTdEVYdHN2Zzpjb21tZW50ACBHZW5lcmF0b3I6IFNrZXRjaCAzLjAuMyAoNzg5MSkgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggbh/q1QAAABB0RVh0c3ZnOnRpdGxlAFBlcnNvbjwcGLsAAAAYdEVYdFRodW1iOjpEb2N1bWVudDo6UGFnZXMAMaf/uy8AAAAYdEVYdFRodW1iOjpJbWFnZTo6SGVpZ2h0ADI0NvDYdVgAAAAXdEVYdFRodW1iOjpJbWFnZTo6V2lkdGgAMjQx/U2wpgAAABl0RVh0VGh1bWI6Ok1pbWV0eXBlAGltYWdlL3BuZz+yVk4AAAAXdEVYdFRodW1iOjpNVGltZQAxNTQ2OTc3MzIyCp5w8AAAABF0RVh0VGh1bWI6OlNpemUANjg1N0Kg2mwTAAAAYnRFWHRUaHVtYjo6VVJJAGZpbGU6Ly8vaG9tZS93d3dyb290L25ld3NpdGUvd3d3LmVhc3lpY29uLm5ldC9jZG4taW1nLmVhc3lpY29uLmNuL2ZpbGVzLzExOS8xMTk4NTgxLnBuZ+cNqJ8AAAAASUVORK5CYII=" width="18px">&nbsp;<span v-html="row.name"></span>
                    </div>
                  </template>
                </div>
            </div>
        </div>
      </div>
      <el-drawer
        :visible.sync="drawerShow"
        :append-to-body="true"
        :show-close="false"
        direction="rtl">
        <h3 slot="title" class="title-head">属性编辑栏</h3>
        <el-form ref="form" :model="form" label-width="80px" class="attr-form">
        <div class="tab-container">
          <el-tabs v-model="activeName">
            <el-tab-pane label="节点信息" name="nodeInfo">
              <el-form-item label="节点ID">
                <el-input v-model="form.process_id"  :disabled="true" style="width: 50px;"></el-input>
              </el-form-item>
              <el-form-item label="步骤名称">
                <el-input v-model="form.process_name" ></el-input>
              </el-form-item>
              <el-form-item label="步骤尺寸">
                <el-col :span="11">
                  <el-input v-model="form.style_width" ></el-input>
                </el-col>
                <el-col class="line" :span="2"> X </el-col>
                <el-col :span="11">
                  <el-input v-model="form.style_height" ></el-input>
                </el-col>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="节点属性" name="nodeAttr">
              <el-form-item label="步骤类型">
                <el-radio-group v-model="form.process_type">
                  <el-radio label="is_step">正常步骤</el-radio>
                  <el-radio label="is_one" >第一步</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="调用方法">
                <el-input v-model="form.wf_action" ></el-input>
              </el-form-item>
              <el-form-item label="会签方式">
                <el-select v-model="form.is_sing" placeholder="请选择">
                  <el-option
                    v-for="item in options_sing"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="回退方式">
                <el-select v-model="form.is_back" placeholder="请选择">
                  <el-option
                    v-for="item in options_back"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="节点人员" name="nodePeople">
              <el-form-item label="办理人员">
                <el-select v-model="form.auto_person" placeholder="请选择" @change="selectedAutoPerson">
                  <template v-for="item in manager">
                    <template v-if="form.process_type=='is_one'">
                      <el-option
                        v-if="item.value!='3'"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </template>
                    <template v-else>
                      <el-option
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </template>
                  </template>
                </el-select>
              </el-form-item>
              <el-row v-if="form.auto_person!='6'">
                <el-col :span="6" class="selected-manager">
                  <h3>{{managerInfo}}</h3>
                  <el-button @click="selectManager">选择</el-button>
                </el-col>
                <el-col :span="18">
                  <el-table
                    v-if="form.auto_person=='3'"
                    :data="rangeUserText"
                    height="450"
                    style="width: 100%;">
                    <el-table-column
                      prop="date"
                      label="序号"
                      width="180">
                      <template slot-scope="scope">
                      {{scope.$index}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="姓名"
                      width="180">
                      <template slot-scope="scope">
                      {{scope.row}}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="form.auto_person=='4'"
                    :data="autoSponsorText"
                    height="450"
                    style="width: 100%;">
                    <el-table-column
                      prop="date"
                      label="序号"
                      width="180">
                      <template slot-scope="scope">
                        {{scope.$index}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="姓名"
                      width="180">
                      <template slot-scope="scope">
                        {{scope.row}}
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-table
                    v-if="form.auto_person=='5'"
                    :data="autoRoleText"
                    height="450"
                    style="width: 100%;">
                    <el-table-column
                      prop="date"
                      label="序号"
                      width="180">
                      <template slot-scope="scope">
                        {{scope.$index}}
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="name"
                      label="姓名"
                      width="180">
                      <template slot-scope="scope">
                        {{scope.row}}
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>
              </el-row>
              <el-row v-else>
                <el-col :span="6" style="padding-top: 12px;">事务接受：</el-col>
                <el-col :span="18">
                  <el-form-item label="取业务表">
                    <el-col :span="11">
                      <el-select v-model="form.work_text" placeholder="请选择">
                        <el-option
                          v-for="item in tableFields"
                          :key="item.field_name"
                          :label="item.field_text"
                          :value="item.field_name">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col class="line" :span="2"> 的 </el-col>
                    <el-col :span="11">
                      <el-select v-model="form.work_ids" placeholder="请选择">
                        <el-option
                          v-for="item in workIds"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="节点转出" name="nodeSend">
              <el-form-item label="步骤模式">
                <el-select v-model="form.wf_mode" placeholder="请选择">
                  <el-option
                    v-for="item in stepData"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <div v-if="form.wf_mode=='1'">
                  <table class="table-step">
                    <thead>
                    <tr><th style="width:50px;">步骤</th><th>转出条件设置</th></tr>
                    </thead>
                    <tbody>
                    <!--模板-->
                    <tr v-for="step in form.process_in_set" :key="'step'+step.id">
                      <td style="width: 30px;">步骤{{step.id}}</td>
                      <td>
                        <table class="table table-condensed">
                          <tbody>
                          <tr>
                            <td>
                              <select class="smalls" style="width: 120px;" :data-step="step.id" name="field" @change="setProcessOutDataField">
                                <option value="">选择字段</option>
                                <option :value="fields.field_name" v-for="fields in tableFields" :key="'fields'+step.id+fields.field_name">{{fields.field_text}}</option>
                              </select>
                              <select class="smalls" style="width: 60px;" name="con" :data-step="step.id" @change="setProcessOutDataField">
                                <option value="">选择条件</option>
                                <option :value="con.value" v-for="con in outCondition" >{{con.label}}</option>
                              </select>
                              <input type="text" class="smalls" style="width: 80px;" name="value" :data-step="step.id" @change="setProcessOutDataField">
                              <select class="smalls" style="width: 80px;" name="logic" :data-step="step.id" @change="setProcessOutDataField">
                                <option value="">选择逻辑</option>
                                <option :value="logic.value" v-for="logic in outConditionLogic">{{logic.label}}</option>
                              </select>
                            </td>
                            <td>
                              <button type="button" class="wf_btn" @click="addLeftParenthesis(step.id)">（</button>
                              <button type="button" class="wf_btn" @click="addRightParenthesis(step.id)">）</button>
                              <button type="button" class="wf_btn" @click="addConditions(step.id)">新增</button>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <select multiple  style="width: 100%;height: 160px;" v-model="selCon">
                                <option :value="cData" v-for="cData in step.condition" :key="'from_data'+cData">{{cData}}</option>
                              </select>
                            </td>
                            <td>
                              <button type="button"  class="wf_btn" @click="delCon(step.id)">删行</button>
                              <button type="button"  class="wf_btn" @click="clearCon(step.id)">清空</button>
                            </td>
                          </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </el-tab-pane>
            <el-tab-pane label="节点事务" name="nodeTrans">
              <div class="node-trans">
                <table class="trans-tables">
                  <tbody><tr><td width="160px" style="display:table-cell; vertical-align:middle">事务SQL
                    <hr>
                    单据ID：@from_id<br>
                    节点ID：@run_id<br>
                    提交意见：@check_con

                  </td><td><textarea name="work_sql" type="text/plain" v-model="form.work_sql" style="width:100%;height:100px;"></textarea>
                    Tip:UPDATE Table SET field1=value1 WHERE id=@run_id;
                  </td></tr>
                  <tr><td style="display:table-cell; vertical-align:middle">事务MSG
                    <hr>
                    单据ID：@from_id<br>
                    节点ID：@run_id<br>
                    提交意见：@check_con
                  </td><td><textarea name="work_msg" v-model="form.work_msg" type="text/plain" style="width:100%;height:100px;"></textarea>
                    Tip:您好,您有需要审批的业务,业务编号为：@run_id;
                  </td></tr>
                  </tbody></table>
              </div>
            </el-tab-pane>
          </el-tabs>
          <el-form-item size="large" class="save-attr-btn">
            <el-button type="primary" @click="saveAttr">保存</el-button>
            <el-button @click="drawerShow=false">取消</el-button>
          </el-form-item>
        </div>
        </el-form>
      </el-drawer>
      <el-dialog title="选择办理对象" :visible.sync="open" width="700px" height="800px" append-to-body>
        <div class="select-dialog">
          <el-col :span="11">
            <el-input v-model="managerKey" placeholder="请输入搜索内容"></el-input>
          </el-col>
          <el-col :span="11">
            <el-button type="success" size="mini" plain  class="search" @click="getSelectManageData">搜索</el-button>
          </el-col>
          <div class="transfer-selector">
            <el-transfer
              v-model="managerValue"
              :props="{
                            key: 'value',
                            label: 'label'
                          }"
              :data="ManagerData">
            </el-transfer>
          </div>
          <div class="save-selected">
            <el-button type="primary" size="normal" plain  @click="managerSelectedOk">确定</el-button>
          </div>
          </div>
      </el-dialog>
      <ul class="copyright">
        <li>流程引擎归属<a href="https://www.cojz8.com/" target="_blank" class="text-danger">TPFLOW</a>版权所有</li>
      </ul>
    </div>
</template>

<script>
    import {jsPlumb} from 'jsplumb';
    import _ from 'lodash';

    export default {
        name: "Workflow",
        jsPlumb: null,
        props:{
          processList:Array,
          tableFields:Array,
          ManagerData:Array,
          processStep:Array,
        },
        data() {
            return {
              dragPos:{
                startL:0,
                startT:0,
                endL:0,
                endT:0
              },
              timeOut:0,
              selCon:[],//当前选中的条件
              processOutData:[],  //转出数据
              stepData:[],
              managerKey:'',
              rangeUserText:[],
              autoSponsorText:[],
              autoRoleText:[],
              managerTitle:'',
              jsPlumbInit: false,
              drawerShow:false,
              open:false,
              managerValue: [],
              activeName: 'nodeInfo',
              outCondition:[
                {label:'=',value:'='},
                {label:'<>',value:'<>'},
                {label:'>',value:'>'},
                {label:'<',value:'<'},
                {label:'>=',value:'>='},
                {label:'<=',value:'<='},
                {label:'含',value:'include'},
                {label:'不含',value:'exclude'},
              ],
              outConditionLogic:[
                {label:'AND',value:'AND'},
                {label:'OR',value:'OR'},
              ],
              workIds:[
                {label:'制单人员',value:'1'}
              ],
              options_sing:[
                {label:"允许会签",value:"1"},
                {label:"禁止会签",value:"2"},
              ],
              options_back:[
                {label:"允许回退",value:"1"},
                {label:"禁止回退",value:"2"},
              ],
              manager:[
                {label:"自由选择",value:'3'},
                {label:"指定人员",value:'4'},
                {label:"指定角色",value:'5'},
                {label:"事务接受",value:'6'},
              ],

              form:{
                flow_id:0,
                process_id:0,
                process_name:"",
                style_width:120,
                style_height:'auto',
                process_type:'is_step',
                wf_action:'view',
                is_sing:'1',
                is_back:'1',
                auto_person:'4',
                range_user_ids:'',
                range_user_text:'',
                auto_sponsor_ids:'',
                auto_sponsor_text:'',
                auto_role_ids:'',
                auto_role_text:'',
                work_text:'',
                work_ids: '1',
                wf_mode: '0',
                process_in_set: [],
                work_sql:'',
                work_msg:'',
                process_condition: '',
              },
              connection:{},//节点连接对象
              canvasDataRoom: 100,
            }
        },
        mounted() {
            this.$options.jsPlumb = jsPlumb.getInstance();
            this.initJsPlumb();
            this.initFlow()
        },
        computed: {
          processListTmp:{
            get(){
              return this.processList
            },
            set(data){
              this.$emit('setProcessList',data)
            },
          },
          managerInfo:{
            get(){
              return this.managerTitle
            },
            set(data){
              let mi = ''
              this.manager.some(info=>{
                if(info.value==data){
                  mi = info.label
                  return true
                }
                return false
              })
              this.managerTitle =  mi
            }
          },
          canvasRoomMinusEnable() {
              return this.canvasDataRoom > 50;
          },
          canvasRoomPlusEnable() {
              return this.canvasDataRoom < 100;
          },
          canvasRoomScaleStyle() {
              return {
                  transform: 'scale(' + this.canvasDataRoom / 100 + ')'
              };
          }
        },
        methods: {
          initFlow() {
            const _this = this
            _this.$options.jsPlumb.bind('click', function (conn, originalEvent) {
              _this.$confirm('确定删除所点击的链接吗？', "警告", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              })
                .then(function () {
                  _this.$options.jsPlumb.deleteConnection(conn)
                  delete _this.connection[conn.sourceId+"_"+conn.targetId]
                  _this.processListTmp.some((item ,index)=>{
                    if('window'+item.id==conn.sourceId){
                      let toArr = item.process_to.split(",");
                      toArr.forEach((prsto,pi)=>{
                        if('window'+prsto==conn.targetId){
                          toArr.splice(pi,1)
                          item.process_to = toArr.join(',')
                        }
                      })
                      return true
                    }
                  })
                  _this.$nextTick(()=> {
                    _this.clearJsPlumb()
                    _this.reDraw()
                  })
                })
                .catch(function (response) {});
            })
          },

          reDraw(){
            const _this = this
            _this.processListTmp.forEach((item) => {
              if(item.process_to) {
                let toArr = item.process_to.split(",");
                toArr.forEach((prsto)=>{
                  //设置连线
                  _this.draggableFlowConnect('window' + item.id, 'window' + prsto,true)
                })
              }
              //设置sourceTarget
              if(!_this.$options.jsPlumb.isSource('flag'+item.id)){
                _this.$options.jsPlumb.makeSource('flag'+item.id, {
                  parent:'window'+item.id,
                  anchor:"Continuous",
                  endpoint:[ "Dot", { radius:1 } ],
                  connector:[ "Flowchart", { stub:[5, 5] } ],
                  dragOptions:{},
                  maxConnections:-1
                });
              }

              //设置target
              if(!_this.$options.jsPlumb.isTarget('window'+item.id)){
                _this.$options.jsPlumb.makeTarget('window'+item.id, {
                  dropOptions:{ hoverClass:"hover", activeClass:"active" },
                  anchor:"Continuous",
                  maxConnections:-1,
                  endpoint:[ "Dot", { radius:1 } ],
                  paintStyle:{ fillStyle:"#ec912a",radius:1 },
                  beforeDrop:function(params){
                    if(params.sourceId == params.targetId) return false;/*不能链接自己*/
                    let j = 0;
                    _this.processListTmp.every((item)=>{
                      let toArr =item.process_to.split(",")
                      toArr = toArr.map(ta=>{
                        ta = 'window'+ta
                        return ta
                      })
                      if('flag'+item.id==params.sourceId && toArr.includes(params.targetId)){
                        j++
                        return false
                      }
                      return true
                    })
                    if( j > 0 ){
                      _this.msgError("步骤连接重复");
                      return false;
                    } else {
                      _this.processListTmp.map((item,ik)=>{
                        if('flag'+item.id==params.sourceId){
                          let  itemTarget = item.process_to.split(',')
                          itemTarget.push(params.targetId.substr(6))
                          itemTarget = itemTarget.filter(filter=>{
                            return filter!=""
                          })
                          item.process_to = itemTarget.join(",")
                        }
                      })
                      _this.$nextTick(()=> {
                        _this.clearJsPlumb()
                        _this.reDraw()
                      })
                      return false;
                    }
                  }
                });
              }
              //设置拖动
              _this.$options.jsPlumb.draggable('window'+item.id,{containment: 'parent',start:function(e){
                  _this.dragPos.startL = e.el.offsetLeft
                  _this.dragPos.startT = e.el.offsetTop
                },stop:function (e){
                  _this.dragPos.endL = e.el.offsetLeft
                  _this.dragPos.endT = e.el.offsetTop
                }});
            })
          },

          initJsPlumb() {
            const _this = this
            _this.$options.jsPlumb.ready(() => {
                _this.jsPlumbInit = true;
                _this.$options.jsPlumb.importDefaults({
                  ConnectionsDetachable: false,
                  LogEnabled: true,
                  ConnectionOverlays: [  //连线的叠加组件，如箭头、标签
                    ["Arrow", {  //箭头参数设置
                      location: 1,
                      visible: true,
                      width: 11,
                      length: 11,
                      id: "ARROW",
                      events: {
                        click: function () {
                        }
                      }
                    }],
                    ["Label", {  //标签参数设置
                      location: 0.1,
                      id: "label",
                      cssClass: "aLabel", //hover时label的样式名
                      events: {
                        tap: function () {
                        }
                      },
                      visible: true
                    }]
                  ],
                  Connector: "Flowchart", //连线的类型，流程图(Flowchart)、贝塞尔曲线等
                  //父级元素id；假如页面元素所在上层不同，最外层父级一定要设置
                  Container: "module",
                  //如果请求不存在的Anchor、Endpoint或Connector，是否抛异常
                  DoNotThrowErrors: false,
                  //通过jsPlumb.draggable拖拽元素时的默认参数设置
                  DragOptions: {cursor: 'pointer', zIndex: 2000},
                  DropOptions: {}, //target Endpoint放置时的默认参数设置
                  Endpoint: "Dot", //端点（锚点）的样式声明
                  //用jsPlumb.connect创建连接时，source端点和target端点的样式设置
                  Endpoints: [null, null],
                  EndpointOverlays: [], //端点的叠加物
                  //端点的默认样式
                  EndpointStyle: { stroke: '#1565C0', strokeWidth: 1},
                  EndpointStyles: [null, null], //连线的source和target端点的样式
                  //端点hover时的样式
                  EndpointHoverStyle: {stroke: '#f00', strokeWidth: 1},
                  //连线的source和target端点hover时的样式
                  EndpointHoverStyles: [null, null],
                  //连线hover时的样式
                  HoverPaintStyle: {stroke: '#f00', strokeWidth: 2},
                  LabelStyle: {color: "black"}, //标签的默认样式，用css写法。
                  Overlays: [], //连线和端点的叠加物
                  MaxConnections: 10, //端点支持的最大连接数
                  //连线样式
                  PaintStyle: {stroke: '#1565C0', strokeWidth: 1, joinstyle: 'round'},
                  ReattachConnections: true, //是否重新连接使用鼠标分离的线?
                  RenderMode: "svg", //默认渲染模式
                  Scope: "jsPlumb_DefaultScope", //范围，具有相同scope的点才可连接
                  reattach: true,
                });
            });
          },

          //设置节点连接
          draggableFlowConnect(source, target, isNow) {
            let _this = this;
            function doDraw() {
              if (_this.jsPlumbInit) {
                let connIndex = source+"_"+target
                if(_this.connection[connIndex]){
                  _this.$options.jsPlumb.deleteConnection(_this.connection[connIndex])
                }
                _this.connection[connIndex] =_this.$options.jsPlumb.connect({
                  source: source,
                  target: target,
                  endpoint: 'Dot',
                  // 连接线的样式
                  connectorStyle: {strokeStyle: "#ccc", joinStyle: "round", outlineColor: "#ccc"}, // 链接 style
                  // 连接线配置，起点可用
                  connector: ["Flowchart", {
                    stub: [10, 20],
                    gap: 1,
                    cornerRadius: 2,
                    alwaysRespectStubs: true
                  }], //  链接
                  //
                  endpointStyle: {fill: 'transparent', outlineStroke: 'transparent', outlineWidth: 2},
                  // 线的样式
                  paintStyle: {stroke: 'lightgray', strokeWidth: 2},
                  // 锚点的位置
                  anchor: 'Continuous',
                  // 遮罩层-设置箭头
                  overlays: [
                    ['PlainArrow', {width: 10, length: 10, location: 1}],
                    ['Custom', {
                      location: .5,
                      id: 'nodeTempSmall',
                      create: function () {
                        let $el = _this.$refs[target][0].$el;
                        $el.dataset.target = target;
                        $el.dataset.source = source;
                        return $el;
                      },
                      visible: false
                    }],
                    ["Label", {cssClass: "flow-component flow-label",label: source.substr(6)+" - "+target.substr(6),}]
                  ]
                });
              }
            }

            if (isNow) {
              doDraw();
            } else {
              this.$nextTick(() => {
                doDraw();
              });
            }
          },

          handleMinusCanvas() {
            if (this.canvasDataRoom <= 50) {
              return;
            }
            this.canvasDataRoom = this.canvasDataRoom - 10;
          },
          handlePlusCanvas() {
            if (this.canvasDataRoom === 100) {
              return;
            }
            this.canvasDataRoom = this.canvasDataRoom + 10;
          },
          resetForm(){
            this.form = {
              flow_id:0,
              process_id:0,
              process_name:"",
              style_width:120,
              style_height:'auto',
              process_type:'is_step',
              wf_action:'view',
              is_sing:'1',
              is_back:'1',
              auto_person:'4',
              range_user_ids:'',
              range_user_text:'',
              auto_sponsor_ids:'',
              auto_sponsor_text:'',
              auto_role_ids:'',
              auto_role_text:'',
              work_text:'',
              work_ids: '1',
              wf_mode: '0',
              process_in_set: [],
              work_sql:'',
              work_msg:'',
              process_condition: '',
            }
          },
          showAttr(sourceId){
              let tag = true //拖拽超过5px不弹出属性设置框
              if(Math.abs(this.dragPos.startL-this.dragPos.endL)>5||Math.abs(this.dragPos.startT-this.dragPos.endT)>5){
                tag = false
              }
              this.dragPos = {
                startL:0,
                startT:0,
                endL:0,
                endT:0
              }
              if (!tag){
                return false
              }
              clearTimeout(this.timeOut)
              this.timeOut = setTimeout(()=>{
                this.resetForm()
                this.processListTmp.some(item=>{
                  if(item.id==sourceId){
                    this.form.flow_id = item.flow_id
                    this.form.process_id = item.id
                    this.form.process_name = item.process.process_name
                    const style = JSON.parse(item.process.style)
                    this.form.style_width = style.width
                    this.form.style_height = style.height
                    this.form.process_type = item.process.process_type
                    this.form.is_sing = ''+item.process.is_sing
                    this.form.is_back = ''+item.process.is_back
                    this.form.auto_person = ''+item.process.auto_person
                    this.managerInfo = this.form.auto_person
                    this.rangeUserText = item.process.range_user_text?item.process.range_user_text.split(','):[]
                    this.autoSponsorText = item.process.auto_sponsor_text?item.process.auto_sponsor_text.split(','):[]
                    this.autoRoleText = item.process.auto_role_text?item.process.auto_role_text.split(','):[]
                    this.form.range_user_ids = item.process.range_user_ids
                    this.form.range_user_text = item.process.range_user_text
                    this.form.auto_sponsor_ids = item.process.auto_sponsor_ids
                    this.form.auto_sponsor_text = item.process.auto_sponsor_text
                    this.form.auto_role_ids = item.process.auto_role_ids
                    this.form.auto_role_text = item.process.auto_role_text
                    this.form.work_ids = item.process.work_ids
                    this.form.work_text = item.process.work_text
                    this.form.wf_mode = ''+item.process.wf_mode
                    let processTo = item.process_to?item.process_to.split(','):[]
                    this.form.process_condition = item.process_to
                    if(processTo.length>1){
                      this.stepData = [
                        {label:'转出模式（符合执行）',value:'1'},
                        {label:'同步模式（均需办理）',value:'2'},
                      ]
                    }else {
                      this.stepData = [
                        {label:'单线模式（流程为直线型单一办理模式）',value:'0'},
                      ]
                    }
                    this.form.work_sql = item.process.work_sql
                    this.form.work_msg = item.process.work_msg
                    return true;
                  }
                  return false
                })
                this.form.process_in_set = []
                this.processStep.forEach(step=>{
                  if (step.prev_id==sourceId){
                    this.form.process_in_set.push(step)
                  }
                })
                this.drawerShow = true
              },300)
          },
          deleteNode(sourceId){
            const _this = this
            clearTimeout(_this.timeOut)
            _this.$confirm('确定删除所点击的节点吗？', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(function () {
                _this.$emit("deleteFlowNode",{sourceId:sourceId})
              })
              .catch(function (response) {});
          },
          //清空步骤
          clearAllNodes(){
            const _this = this
            _this.$confirm('确定要清空所有的节点吗？', "警告", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(function () {
                _this.$emit("clearAllNodes")
              })
              .catch(function (response) {});
          },
          //添加流程步骤
          addProcess(){
            this.$emit("addProcess")
          },
          //保存设计
          saveProcess(){
            let data  = [];
            this.processListTmp.map(item=>{
              let left = document.getElementById('window'+item.id).style.left.replace('px','')
              let top  = document.getElementById('window'+item.id).style.top.replace('px','')
              data.push({id:item.id,left:left,top:top,process_to:item.process_to})
            })
            this.$emit('saveProcess',data)
          },
          //刷新
          wfRefresh(){
            this.processListTmp = [];
            this.$emit("getProcessData")
          },
          //重置设计器
          clearJsPlumb(){
            this.connection = {}
            this.$options.jsPlumb.deleteEveryConnection()
            this.$options.jsPlumb.deleteEveryEndpoint()
            this.$options.jsPlumb.unmakeEverySource()
            this.$options.jsPlumb.unmakeEveryTarget()
          },
          selectManager(){
            this.managerKey=''
            this.managerValue = []
            this.getSelectManageData()
            this.open = true
          },
          getSelectManageData(){
            let type
            let keywords = this.managerKey
            if(this.form.auto_person=='3'||this.form.auto_person=='4'){
              type = 'getUser'
            }else if(this.form.auto_person=='5'){
              type = 'getDepartment'
            }
            this.$emit("getManager",{type:type,key:keywords})
          },
          managerSelectedOk(){
            if(this.form.auto_person=='3'){
              this.form.range_user_ids = this.managerValue.join(',')
              this.rangeUserText = [];
              this.ManagerData.forEach(item=>{
                if(this.managerValue.includes(item.value)){
                  this.rangeUserText.push(item.label)
                }
              })
              this.form.range_user_text = this.rangeUserText.join(',')
            }else if(this.form.auto_person=='4'){
              this.form.auto_sponsor_ids = this.managerValue.join(',')
              this.autoSponsorText = [];
              this.ManagerData.forEach(item=>{
                if(this.managerValue.includes(item.value)){
                  this.autoSponsorText.push(item.label)
                }
              })
              this.form.auto_sponsor_text = this.autoSponsorText.join(',')
            }else if(this.form.auto_person=='5'){
              this.form.auto_role_ids = this.managerValue.join(',')
              this.autoRoleText = [];
              this.ManagerData.forEach(item=>{
                if(this.managerValue.includes(item.value)){
                  this.autoRoleText.push(item.label)
                }
              })
              this.form.auto_role_text = this.autoRoleText.join(',')
            }
            this.open=false
          },
          setProcessOutDataField(e){
            this.setArrValue(this.processOutData,e.target.dataset.step,e.target.name,e.target.value)
          },
          addLeftParenthesis(id){
            let index = _.findIndex(this.form.process_in_set,item=>{return item.id == id})
            if(index<0){
              this.msgError('请先添加条件，再选择括号')
              return false
            }
            //获取逻辑符号
            let pIndex = _.findIndex(this.processOutData,item=>{return item.id==id})
            if(pIndex<0 || !this.processOutData[pIndex].logic){
              this.msgError('请先选择逻辑运算符，再选择括号')
              return false
            }
            let condition = _.last(this.form.process_in_set[index].condition)
            //已经有条件的话
            if( (this.trim(condition).substr(-3,3) == 'AND') || (this.trim(condition).substr(-2,2) == 'OR') ){
              this.msgError("无法编辑已经存在关系的条件");
              return false;
            }
            if(condition.indexOf('(')>=0){
              this.msgError("条件表达式书写错误,请检查括号匹配");
              return false;
            }
            condition+= ' ' + this.processOutData[pIndex].logic
            this.form.process_in_set[index].condition = _.slice(this.form.process_in_set[index].condition,0,this.form.process_in_set[index].condition.length-1)
            this.form.process_in_set[index].condition.push(condition)
            this.form.process_in_set[index].condition.push("(")
          },
          addRightParenthesis(id){
            let index = _.findIndex(this.form.process_in_set,item=>{return item.id == id})
            if(index<0){
              this.msgError('请先添加条件，再选择括号')
              return false
            }

            let condition = _.last(this.form.process_in_set[index].condition)
            //已经有条件的话
            if( (this.trim(condition).substr(-3,3) == 'AND') || (this.trim(condition).substr(-2,2) == 'OR') ){
              this.msgError("无法编辑已经存在关系的条件");
              return false;
            }
            if(this.trim(condition).length==1){
              this.msgError("请添加条件");
              return false;
            }
            if(!this.checkExp(condition)){
              condition+= ')'
              this.form.process_in_set[index].condition.splice(this.form.process_in_set[index].condition.length-1,1,condition)
            }
          },
          addConditions(id){
            let pIndex = _.findIndex(this.processOutData,item=>{return item.id==id})
            if(pIndex<0){
              this.msgError('请补充完整条件')
              return false
            }
            let sField= this.processOutData[pIndex].field, sCon =this.processOutData[pIndex].con,sValue = this.processOutData[pIndex].value
            let bAdd = true;
            if( sField && sCon && sValue){
              let sLength = 0
              let index = _.findIndex(this.form.process_in_set,item=>{return item.id == id})
              if(index>=0){
                if(!this.form.process_in_set[index].condition){
                  this.form.process_in_set[index].condition = []
                }
                let oObj = this.form.process_in_set[index].condition
                if( oObj.length>0 ){
                  sLength = oObj.length
                  let sText = oObj[sLength-1]
                  if(!this.checkExp(sText)){
                    bAdd = false;
                  }
                }
                if( sValue.indexOf("'")>=0 ){
                  this.msgError("值中不能含有'号")
                  return
                }
                let sNewText = "" + sField + "" + sCon + " '" + sValue + "'"
                let sNewText_text = "" + sField + "" + sCon + " '" + sValue + "'"
                for( let i=0;i<oObj.length;i++ ){
                  if( oObj[i].indexOf(sNewText)>=0 ){
                    this.msgError("条件重复")
                    return
                  }
                }
                let sRelation = this.processOutData[pIndex].logic
                if( bAdd ){
                  let nPos = oObj.length;
                  if( nPos>0 ){
                    if(!sRelation || typeof sRelation == 'undefined'){
                      this.msgError('请选择逻辑运算符')
                      return
                    }
                    this.form.process_in_set[index].condition[nPos-1] +=" "+ sRelation
                  }
                  this.form.process_in_set[index].condition.push(sNewText)
                } else {
                  let con = this.form.process_in_set[index]
                  if( this.trim(oObj[sLength-1]).length==1 ){
                    con.condition[sLength-1]+=sNewText_text;
                  } else {
                    if(!sRelation || typeof sRelation == 'undefined'){
                      this.msgError('请选择逻辑运算符')
                      return
                    }
                    con.condition[sLength-1]+=" " + sRelation + " " + sNewText_text;
                  }
                  this.form.process_in_set.splice(index,1,con)
                }
              }
            }else{
              this.msgError('请补充完整条件')
              return false
            }
          },
          delCon(id){
            let index = _.findIndex(this.form.process_in_set,item=>{return item.id == id})
            if(index<0){
              return
            }
            if(this.selCon.length>0){
              this.selCon.forEach(item=>{
                let cIndex = _.findIndex(this.form.process_in_set[index].condition,cItem=>{return item == cItem})
                this.form.process_in_set[index].condition.splice(cIndex,1)
              })
            }else{
              this.form.process_in_set[index].condition.pop()
            }
            let condition = _.last(this.form.process_in_set[index].condition)
            if(condition) {
              condition = condition.replace(/(AND|OR)$/, '');
              this.form.process_in_set[index].condition = _.slice(this.form.process_in_set[index].condition, 0, this.form.process_in_set[index].condition.length - 1)
              this.form.process_in_set[index].condition.push(condition)
            }
          },
          clearCon(id){
            let index = _.findIndex(this.form.process_in_set,item=>{return item.id == id})
            if(index<0){
              return
            }
            this.form.process_in_set[index].condition = []
          },
          selectedAutoPerson(value){
            this.managerInfo = value
          },
          setArrValue(arr,id,name,value){
            let index = _.findIndex(arr,item=>{return item.id==id})
            if(index<0){
              arr.push(JSON.parse('{"id":"'+id+'","'+name+'":"'+value+'"}'))
            }else{
              arr[index][name] = value
            }
          },
          checkFlow(){
            this.$emit('checkFlow')
          },
          saveAttr(){
            this.$emit("doSaveAttr",this.form)
            this.drawerShow = false
          },
          trim(str) {
            return (str + '').replace(/(\s+)$/g, '').replace(/^\s+/g, '');
          },
          checkExp(text){
            //检查公式
            if( text.indexOf("(")>=0 ){
              let num1 = text.split("(").length;
              let num2 = text.split(")").length;
              if( num1!=num2 ) {
                return false;
              }
            }
            return true;
          }
        }
    }
</script>

<style lang="sass">
    @import "../../assets/styles/gflow/workflow.scss"
</style>
