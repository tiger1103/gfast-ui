<template>
  <div class="personal">
    <el-row>
      <!-- 个人信息 -->
      <el-col :xs="24" :sm="16">
        <el-card shadow="hover" header="个人信息">
          <div class="personal-user">
            <div class="personal-user-left">
              <el-upload
                  class=" h100 personal-user-left-upload avatar-uploader"
                  :action="baseURL+'/api/v1/system/upload/singleImg'"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="dataParam"
              >
                <img v-if="imageUrl" :src="proxy.getUpFileUrl(imageUrl)" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><ele-Plus  /></el-icon>

              </el-upload>
            </div>
            <div class="personal-user-right">
              <el-row>
                <el-col :span="24" class="personal-title mb18">{{ currentTime }}，{{ personalForm.nickname }}，{{ personalForm.describe }}！ </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">昵称：</div>
                      <div class="personal-item-value">	{{ personalForm.nickname }}</div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">联系电话：</div>
                      <div class="personal-item-value">{{ personalForm.mobile }}</div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">登录IP：</div>
                      <div class="personal-item-value">{{personalForm.lastLoginIp}}</div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">登录时间：</div>
                      <div class="personal-item-value">{{personalForm.lastLoginTime}}</div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="24">
                  <el-row>
                    <el-col :xs="24" :sm="8" class="personal-item mb6">
                      <div class="personal-item-label">所属部门：</div>
                      <div class="personal-item-value">{{ deptName }}</div>
                    </el-col>
                    <el-col :xs="24" :sm="16" class="personal-item mb6">
                      <div class="personal-item-label">所属角色：</div>
                      <div class="personal-item-value">{{ roles.join(',') }}</div>
                    </el-col>
                  </el-row>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 消息通知 -->
      <el-col :xs="24" :sm="8" class="pl15 personal-info">
        <el-card shadow="hover">
          <template #header>
            <span>消息通知</span>
            <span class="personal-info-more">更多</span>
          </template>
          <div class="personal-info-box">
            <ul class="personal-info-ul">
              <li v-for="(v, k) in newsInfoList" :key="k" class="personal-info-li">
                <a :href="v.link" target="_block" class="personal-info-li-title">{{ v.title }}</a>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>

      <!-- 营销推荐 -->
      <el-col :span="24">
        <el-card shadow="hover" class="mt15" header="营销推荐">
          <el-row :gutter="15" class="personal-recommend-row">
            <el-col :sm="6" v-for="(v, k) in recommendList" :key="k" class="personal-recommend-col">
              <div class="personal-recommend" :style="{ 'background-color': v.bg }">
                <SvgIcon :name="v.icon" :size="70" :style="{ color: v.iconColor }" />
                <div class="personal-recommend-auto">
                  <div>{{ v.title }}</div>
                  <div class="personal-recommend-msg">{{ v.msg }}</div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 更新信息 -->
      <el-col :span="24">
        <el-card shadow="hover" class="mt15 personal-edit" header="更新信息">
          <div class="personal-edit-title">基本信息</div>
          <el-form :model="personalForm" size="default" label-width="40px" class="mt35 mb35">
            <el-row :gutter="35">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="昵称">
                  <el-input v-model="personalForm.nickname" placeholder="请输入昵称" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="邮箱">
                  <el-input v-model="personalForm.userEmail" placeholder="请输入邮箱" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="签名">
                  <el-input v-model="personalForm.describe" placeholder="请输入签名" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="职业">
                  <el-select v-model="personalForm.remark" placeholder="请选择职业" clearable class="w100">
                    <el-option label="计算机 / 互联网 / 通信" value="1"></el-option>
                    <el-option label="生产 / 工艺 / 制造" value="2"></el-option>
                    <el-option label="医疗 / 护理 / 制药" value="3"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="手机">
                  <el-input v-model="personalForm.mobile" placeholder="请输入手机" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4" class="mb20">
                <el-form-item label="性别">
                  <el-select v-model="personalForm.sex" placeholder="请选择性别" clearable class="w100">
                    <el-option label="男" value="1"></el-option>
                    <el-option label="女" value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                <el-form-item>
                  <el-button type="primary"  @click="handleUpload">
                    <el-icon>
                      <ele-Position />
                    </el-icon>
                    更新个人信息
                  </el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div class="personal-edit-title mb15">账号安全</div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">账户密码</div>
                <div class="personal-edit-safe-item-left-value">当前密码强度：强</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary" @click="handleEditPass">立即修改</el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">密保手机</div>
                <div class="personal-edit-safe-item-left-value">已绑定手机：132****4108</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary">立即修改</el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">密保问题</div>
                <div class="personal-edit-safe-item-left-value">已设置密保问题，账号安全大幅度提升</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary">立即设置</el-button>
              </div>
            </div>
          </div>
          <div class="personal-edit-safe-box">
            <div class="personal-edit-safe-item">
              <div class="personal-edit-safe-item-left">
                <div class="personal-edit-safe-item-left-label">绑定QQ</div>
                <div class="personal-edit-safe-item-left-value">已绑定QQ：110****566</div>
              </div>
              <div class="personal-edit-safe-item-right">
                <el-button text type="primary">立即设置</el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { toRefs, reactive, computed, defineComponent,getCurrentInstance,onMounted } from 'vue';
import { formatAxis } from '/@/utils/formatTime';
import { storeToRefs } from 'pinia';
import { useUserInfo } from '/@/stores/userInfo';
import {getPersonalInfo, editPersonal, resetPwdPersonal} from "/@/api/system/personal";
import type { UploadProps } from 'element-plus'
import {ElMessage} from "element-plus";
import {ElMessageBox} from 'element-plus'
import {getToken} from "/@/utils/gfast"
import { newsInfoList, recommendList } from './mock';
import {Session} from "/@/utils/storage";
// 定义接口来定义对象的类型
interface PersonalState {
  imageUrl:'',
  deptName: '';
  roles: [];
  personalForm: any;
  newsInfoList: any;
  recommendList: any;
}

export default defineComponent({
  name: 'personals',
  setup() {
    const baseURL:string|undefined|boolean = import.meta.env.VITE_API_URL
    const {proxy} = <any>getCurrentInstance();
    const stores = useUserInfo();
    const { userInfos } = storeToRefs(stores);
    const dataParam = reactive({
      token:getToken(),
    })
    const state = reactive<PersonalState>({
      newsInfoList,
      recommendList,
      imageUrl:'',
      deptName:'',
      roles:[],
      personalForm: {
        nickname: '',
        userEmail: '',
        describe: '',
        mobile: '',
        sex: '',
        remark:'',
        avatar:'',
        lastLoginIp:'',
        lastLoginTime:''
      },
    });

    // const  handleUpload =
    const handleUpload = () => {
      // console.log(state.personalForm)
      editPersonal(state.personalForm).then((res:any)=>{
          const userInfo = res.data.userInfo
          userInfo.avatar = proxy.getUpFileUrl(userInfo.avatar)
          // 存储 token 到浏览器缓存
          Session.set('token', res.data.token);
          // 存储用户信息到浏览器缓存
          Session.set('userInfo', userInfo);
          useUserInfo().setUserInfos();
          ElMessage.success('已更新');
      });
    };
    // 当前时间提示语
    const currentTime = computed(() => {

      return formatAxis(new Date());
    });
    const handleAvatarSuccess: UploadProps['onSuccess'] = (
        response,
        uploadFile
    ) => {
       if(response.code == 0){
          state.imageUrl = response.data.path;
          state.personalForm.avatar = response.data.path;
         handleUpload();
       }

    };

    /** 重置密码按钮操作 */
    const handleEditPass = ()=> {
      ElMessageBox.prompt('请输入"' + state.personalForm.nickname + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({ value }) => {
        if(!value || value==''){
          ElMessage.success('密码不能为空');
          return
        }
        resetPwdPersonal({password:value}).then(() => {
          ElMessage.success("修改成功，新密码是：" + value);
        });
      }).catch(() => {});
    };
    // 初始化用户数据
    const initUserInfo = () => {
      getPersonalInfo().then((res:any)=>{
        const user = res.data.user;
        state.imageUrl = user.avatar;
        state.personalForm = {
          nickname:user.userNickname,
          userEmail:user.userEmail,
          describe: user.describe,
          mobile: user.mobile,
          sex: String(user.sex),
          remark:user.remark,
          avatar:user.avatar,
          lastLoginIp:user.lastLoginIp,
          lastLoginTime:user.lastLoginTime
        }
        state.deptName = res.data.deptName;
        state.roles = res.data.roles;
      })

    };
    // 页面加载时
    onMounted(() => {
      initUserInfo();
    });
    return {
      proxy,
      baseURL,
      userInfos,
      currentTime,
      handleUpload,
      handleEditPass,
      handleAvatarSuccess,
      dataParam,
      ...toRefs(state),
    };
  },
});
</script>

<style scoped lang="scss">
@import '../../../theme/mixins/index.scss';
.personal {
  .personal-user {
    height: 130px;
    display: flex;
    align-items: center;
    .personal-user-left {
      width: 130px;
      height: 130px;
      border-radius: 3px;
      :deep(.el-upload) {
        height: 100%;
      }
      .avatar-uploader{
        border: 1px dashed var(--el-border-color);
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: var(--el-transition-duration-fast);
        text-align: center;
        font-size: 20px;
      }
      .personal-user-left-upload {
        img {
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
        &:hover {
          img {
            animation: logoAnimation 0.3s ease-in-out;
          }
        }
      }
    }
    .personal-user-right {
      flex: 1;
      padding: 0 15px;
      .personal-title {
        font-size: 18px;
        @include text-ellipsis(1);
      }
      .personal-item {
        display: flex;
        align-items: center;
        font-size: 13px;
        line-height: 26px;
        .personal-item-label {
          color: var(--el-text-color-secondary);
          @include text-ellipsis(1);
        }
        .personal-item-value {
          @include text-ellipsis(1);
        }
      }
    }
  }
  .personal-info {
    .personal-info-more {
      float: right;
      color: var(--el-text-color-secondary);
      font-size: 13px;
      &:hover {
        color: var(--el-color-primary);
        cursor: pointer;
      }
    }
    .personal-info-box {
      height: 130px;
      overflow: hidden;
      .personal-info-ul {
        list-style: none;
        .personal-info-li {
          font-size: 13px;
          padding-bottom: 10px;
          .personal-info-li-title {
            display: inline-block;
            @include text-ellipsis(1);
            color: var(--el-text-color-secondary);
            text-decoration: none;
          }
          & a:hover {
            color: var(--el-color-primary);
            cursor: pointer;
          }
        }
      }
    }
  }
  .personal-recommend-row {
    .personal-recommend-col {
      .personal-recommend {
        position: relative;
        height: 100px;
        border-radius: 3px;
        overflow: hidden;
        cursor: pointer;
        &:hover {
          i {
            right: 0px !important;
            bottom: 0px !important;
            transition: all ease 0.3s;
          }
        }
        i {
          position: absolute;
          right: -10px;
          bottom: -10px;
          font-size: 70px;
          transform: rotate(-30deg);
          transition: all ease 0.3s;
        }
        .personal-recommend-auto {
          padding: 15px;
          position: absolute;
          left: 0;
          top: 5%;
          color: var(--next-color-white);
          .personal-recommend-msg {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
  }
  .personal-edit {
    .personal-edit-title {
      position: relative;
      padding-left: 10px;
      color: var(--el-text-color-regular);
      &::after {
        content: '';
        width: 2px;
        height: 10px;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        background: var(--el-color-primary);
      }
    }
    .personal-edit-safe-box {
      border-bottom: 1px solid var(--el-border-color-light, #ebeef5);
      padding: 15px 0;
      .personal-edit-safe-item {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .personal-edit-safe-item-left {
          flex: 1;
          overflow: hidden;
          .personal-edit-safe-item-left-label {
            color: var(--el-text-color-regular);
            margin-bottom: 5px;
          }
          .personal-edit-safe-item-left-value {
            color: var(--el-text-color-secondary);
            @include text-ellipsis(1);
            margin-right: 15px;
          }
        }
      }
      &:last-of-type {
        padding-bottom: 0;
        border-bottom: none;
      }
    }
  }
}
</style>
