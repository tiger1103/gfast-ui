<template>
  <div class="">
    <div class="wxchatBorderRightMid">
      <div class="detail-content-title">沟通记录</div>
      <template   v-for="(item,index) in chatList" >
          <div style="margin-left: 30px;margin-top: 15px;"  v-if="item.type == 'A'">
            <el-row>
              <el-col :span="24">
                <span class="font_size padd_r_10">{{item.user.name}}</span>
                <span class="font_size padd_r_10">{{item.time}}</span>
              </el-col>
              <el-col :span="2">
                <el-avatar shape="square" :src="item.user.avatar" style="width: 35px;height: 35px;"></el-avatar>

              </el-col>
              <el-col :span="12">
                <div class="chatPop1">
                  <span style="line-height: 23px;">{{item.content}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div style="margin-left: 30px;margin-top: 15px;" v-if="item.type == 'B'">
    <!--        <div align="center" style="padding: 15px 0;">-->
    <!--          <el-tag type="info" size="mini">12:56</el-tag>-->
    <!--        </div>-->
            <el-row>
              <el-col :span="24" style="text-align: right;">
                <span class="font_size padd_r_10">{{item.user.name}}</span>
                <span class="font_size padd_r_10">{{item.time}}</span>
              </el-col>
              <el-col :span="21">
                <div class="chatPop2">
                  <span style="line-height: 23px;">{{item.content}}</span>
                </div>
              </el-col>
              <el-col :span="2">
                <el-avatar shape="square" :src="item.user.avatar" style="width: 35px;height: 35px;"></el-avatar>
              </el-col>
            </el-row>
          </div>
       </template>
    </div>
    <div class="wxchatBorderRightTop" >
      <div class="detail-content-title">工单详情</div>
      <el-row>
        <el-col :span="12" class="padd_8">
          <el-col :span="6">编号：</el-col> <el-col :span="18">50</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6"  >标题：</el-col> <el-col :span="18">50</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6"  >手机：</el-col> <el-col :span="18">50</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6" >接受提醒：</el-col> <el-col :span="18">手机短信</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6"  >是否公开：</el-col> <el-col :span="18">否</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6"  >提交用户：</el-col> <el-col :span="18">admin</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6" >相关产品/服务：</el-col> <el-col :span="18">产品二</el-col>
        </el-col>
        <el-col :span="12" >
          <el-col :span="6">紧急程度：</el-col> <el-col :span="18">普通</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6"  >状态：</el-col> <el-col :span="18">待评价</el-col>
        </el-col>
        <el-col :span="12" class="padd_8">
          <el-col :span="6"  >创建时间：</el-col> <el-col :span="18">14小时前：</el-col>
        </el-col>

      </el-row>
    </div>
<!--       发送消息-->
<!--    <div class="wxchatBorderRightBottom">-->
<!--      <div>-->
<!--        <div class="wxchatIcon1">-->
<!--          <i class="el-icon-star-off"></i>-->
<!--        </div>-->
<!--        <div class="wxchatIcon2">-->
<!--          <i class="el-icon-folder-remove"></i>-->
<!--        </div>-->
<!--        <div class="wxchatIcon3">-->
<!--          <i class="el-icon-scissors"></i>-->
<!--        </div>-->
<!--        <div class="wxchatIcon4">-->
<!--          <i class="el-icon-chat-dot-round"></i>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div style="margin: -2px 15px;">-->
<!--        <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 3}" placeholder="" v-model="textarea2"-->
<!--                  resize="none" autofocus maxlength="500">-->
<!--        </el-input>-->
<!--      </div>-->
<!--      <div class="sendButton">-->
<!--        <el-button size="mini">发送</el-button>-->
<!--      </div>-->
<!--    </div>-->
  </div>
</template>

<script>
    export default {
        name: "index",
        props:{
          workOrder:{ type:Object,default:()=>{}},
          chatList:{type:Array, default:function(){return [];}},

        }
    }
</script>

<style scoped>
  >>>.el-dialog__header {
    padding: 20px 20px 10px;
  }
  .chatPop1 :hover {
    background-color: #FAFAFA;
  }
  .chatPop1 span {
    background-color: #fff;
    padding: 5px 8px;
    display: inline-block;
    border-radius: 10px;
    margin: 0px 0 10px 10px;
    position: relative;
    border: 1px solid #E3E3E3;
    max-width: 290px;
  }
  .chatPop1 span::after {
    content: '';
    border: 8px solid #ffffff00;
    border-right: 8px solid #fff;
    position: absolute;
    top: 8px;
    left: -16px;
  }
  .chatPop2 :hover {
    background-color: #2683f5;
  }
  .chatPop2 span {
    background-color: #2683f5;
    padding: 5px 8px;
    display: inline-block;
    border-radius: 10px;
    margin: 0px 15px 10px 10px;
    position: relative;
    border: 1px solid #E3E3E3;
    max-width: 290px;
    float: right;
    color: #fff;
  }
  .chatPop2 span::after {
    content: '';
    border: 8px solid #ffffff00;
    border-right: 8px solid #2683f5;
    position: absolute;
    top: 8px;
    right: -16px;
    transform: rotateY(180deg)
  }
  >>>.custom {
    border: 0px solid blue;
    height: 670px;
    width: 795px;
  }
  >>>.wxchatBorder {
    width: 795px;
    height: 670px;
    border: 1px solid red;
    margin-left: -20px;
    margin-top: -59.5px;
  }
  .wxchatBorderLeft {
    width: 250px;
    height: 626px;
    background-color: #eeebe9;
    display: inline-block;
    float: left;
    margin-left: -20px;
    margin-top: -60px;
  }
  .wxchatPeople {
    color: #000000;
    font-size: 14px;
  }
  .wxchatNews {
    color: #999;
    padding-top: 5px;
    font-size: 12px;
  }
  .wxchatName {
    color: #000000;
    font-size: 20px;
    float: left;
    padding-left: 30px;
    padding-top: 20px;
  }
  .wxchatMore {
    color: #999;
    font-size: 20px;
    float: right;
    margin-right: -15px;
    padding-top: 25px;
  }
  >>>.wxchatBorderRight {
    max-width: 245px;
    height: 670px;
    display: inline-block;
    float: right;
    margin-right: -22px;
    margin-top: -60px;
  }
  .wxchatBorderRightTop {
    margin-top: 20px;
    width: 100%;
    height: auto;
    background-color: #ffffff;
  }
  .wxchatBorderRightMid {
    width: 100%;
    height: 566px;
    background-color: #f5f5f5;
    display: block;
    margin-right: -20px;
    overflow-y: scroll;
  }
  .wxchatBorderRightMid::-webkit-scrollbar {
    display: none;
  }
  .wxchatBorderRightBottom {
    width: 545px;
    height: 152px;
    background-color: #fff;
    border: 1px solid #eee;
    display: block;
    float: right;
    margin-right: -20px;
  }
  .wxchatIcon1 {
    display: inline-block;
    padding: 8px 10px 10px 30px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .wxchatIcon2 {
    display: inline-block;
    padding: 8px 10px 10px 20px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .wxchatIcon3 {
    display: inline-block;
    padding: 8px 10px 10px 10px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .wxchatIcon4 {
    display: inline-block;
    padding: 8px 10px 10px 0px;
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  .sendButton {
    float: right;
    margin-top: 5px;
    margin-right: 28px;
  }
  .font_size{line-height: 24px;font-size: 12px;}
  .padd_r_10{padding-right: 15px;}
  .padd_8{padding: 8px;}
  .detail-content-title {
    padding: 11px 16px;
    background: #F4F6F8;
    border-left: 2px solid #3498DB;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: 500;
    color: #333;
  }


</style>
