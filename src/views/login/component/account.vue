<template>
  <el-form ref="loginForm" size="large" class="login-content-form" :model="state.ruleForm" :rules="state.formRules">
    <el-form-item class="login-animation1" prop="userName">
      <el-input type="text" :placeholder="$t('message.account.accountPlaceholder1')" v-model="state.ruleForm.userName"
        clearable autocomplete="off">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation2" prop="password">
      <el-input :type="state.isShowPassword ? 'text' : 'password'"
        :placeholder="$t('message.account.accountPlaceholder2')" v-model="state.ruleForm.password" autocomplete="off"
        @keyup.enter="onSignIn(loginForm)">
        <template #prefix>
          <el-icon class="el-input__icon"><ele-Unlock /></el-icon>
        </template>
        <template #suffix>
          <i class="iconfont el-input__icon login-content-password"
            :class="state.isShowPassword ? 'icon-yincangmima' : 'icon-xianshimima'"
            @click="state.isShowPassword = !state.isShowPassword">
          </i>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item class="login-animation3" prop="verifyCode">
      <el-col :span="15">
        <el-input type="text" maxlength="4" :placeholder="$t('message.account.accountPlaceholder3')"
          v-model="state.ruleForm.verifyCode" clearable autocomplete="off" @keyup.enter="onSignIn(loginForm)">
          <template #prefix>
            <el-icon class="el-input__icon"><ele-Position /></el-icon>
          </template>
        </el-input>
      </el-col>
      <el-col :span="1"></el-col>
      <el-col :span="8">
        <div class="login-content-code">
          <img class="login-content-code-img" @click="getCaptcha" width="130" height="38" :src="state.captchaSrc"
            style="cursor: pointer" />
        </div>
      </el-col>
    </el-form-item>
    <el-form-item class="login-animation4">
      <el-button type="primary" class="login-content-submit" round @click="onSignIn(loginForm)"
        :loading="state.loading.signIn">
        <span>{{ $t('message.account.accountBtnText') }}</span>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts" name="loginAccount">
import type { FormInstance, FormRules } from 'element-plus'

import { ref, reactive, computed, onMounted, inject  } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useI18n } from 'vue-i18n';
import { useUserInfo } from '/@/stores/userInfo';
import { storeToRefs } from 'pinia';
import { useThemeConfig } from '/@/stores/themeConfig';
import { initFrontEndControlRoutes } from '/@/router/frontEnd';
import { initBackEndControlRoutes } from '/@/router/backEnd';
import { Session } from '/@/utils/storage';
import { formatAxis } from '/@/utils/formatTime';
import { NextLoading } from '/@/utils/loading';
import { useLoginApi, captcha } from '/@/api/login';
import {getUpFileUrl} from "/@/utils/gfast";

// 定义变量内容
const { t } = useI18n();
const storesThemeConfig = useThemeConfig();
const { themeConfig } = storeToRefs(storesThemeConfig);
const route = useRoute();
const router = useRouter();
const { signIn } = useLoginApi();
const userInfoStore = useUserInfo()

const loginForm = ref<FormInstance>()

const state = reactive({
  isShowPassword: false,
  ruleForm: {
    userName: 'demo',
    password: '123456',
    verifyCode: '',
    verifyKey: ''
  },
  formRules: {
    userName: [
      { required: true, trigger: "blur", message: "用户名不能为空" }
    ],
    password: [
      { required: true, trigger: "blur", message: "密码不能为空" }
    ],
    verifyCode: [{ required: true, trigger: "blur", message: "验证码不能为空" }]
  },
  loading: {
    signIn: false,
  },
  captchaSrc: '',
});

// 时间获取
const currentTime = computed(() => {
  return formatAxis(new Date());
});

const getCaptcha = () => {
  captcha().then((res: any) => {
    state.captchaSrc = res.data.img
    state.ruleForm.verifyKey = res.data.key
  })
};

onMounted(() => {
  getCaptcha();
});
// 登录
const onSignIn = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid: boolean) => {
    if (valid) {
      state.loading.signIn = true;
      signIn(state.ruleForm).then(async (res: any) => {
        const userInfos = res.data.userInfo
        userInfos.avatar = getUpFileUrl(userInfos.avatar)

        // 存储 token 到浏览器缓存
        Session.set('token', res.data.token);
        // 存储用户信息到浏览器缓存
        Session.set('userInfo', userInfos);
        // 设置用户菜单
        Session.set('userMenu', res.data.menuList)
        // 设置按钮权限
        Session.set('permissions', res.data.permissions)
        // 1、请注意执行顺序(存储用户信息到vuex)
        await userInfoStore.setUserInfos(userInfos);
        await userInfoStore.setPermissions(res.data.permissions)

        if (!themeConfig.value.isRequestRoutes) {
          // 前端控制路由，2、请注意执行顺序
		const isNoPower = await initFrontEndControlRoutes();
          signInSuccess(isNoPower);
        } else {
          // 模拟后端控制路由，isRequestRoutes 为 true，则开启后端控制路由
          // 添加完动态路由，再进行 router 跳转，否则可能报错 No match found for location with path "/"
          const isNoPower=await initBackEndControlRoutes();
          // 执行完 initBackEndControlRoutes，再执行 signInSuccess
          signInSuccess(isNoPower);
        }
      }).catch(() => {
        state.loading.signIn = false;
        state.ruleForm.verifyCode = '';
        getCaptcha()
      })
    }
  }).catch(() => { })
};
// 登录成功后的跳转
const signInSuccess = (isNoPower: boolean | undefined) => {
  if (isNoPower) {
		ElMessage.warning('抱歉，您没有登录权限');
		Session.clear();
	state.loading.signIn = false;
    return;
	}

  // 初始化登录成功时间问候语
  let currentTimeInfo = currentTime.value;
  // 登录成功，跳到转首页
  // 如果是复制粘贴的路径，非首页/登录页，那么登录成功后重定向到对应的路径中
  if (route.query?.redirect) {
    router.push({
      path: <string>route.query?.redirect,
      query: Object.keys(<string>route.query?.params).length > 0 ? JSON.parse(<string>route.query?.params) : '',
    });
  } else {
    router.push('/');
  }
  // 登录成功提示
  // 关闭 loading
  state.loading.signIn = true;
  const signInText = t('message.signInText');
  ElMessage.success(`${currentTimeInfo}，${signInText}`);
  // 添加 loading，防止第一次进入界面时出现短暂空白
  NextLoading.start();
	state.loading.signIn = false;
}
</script>

<style scoped lang="scss">
.login-content-form {
  margin-top: 20px;

  @for $i from 1 through 4 {
    .login-animation#{$i} {
      opacity: 0;
      animation-name: error-num;
      animation-duration: 0.5s;
      animation-fill-mode: forwards;
      animation-delay: calc($i/10) + s;
    }
  }

  .login-content-password {
    display: inline-block;
    width: 20px;
    cursor: pointer;

    &:hover {
      color: #909399;
    }
  }

  .login-content-code {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .login-content-code-img {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background-color: #ffffff;
      border: 1px solid rgb(220, 223, 230);
      cursor: pointer;
      transition: all ease 0.2s;
      border-radius: 4px;
      user-select: none;

      &:hover {
        border-color: #c0c4cc;
        transition: all ease 0.2s;
      }
    }
  }

  .login-content-submit {
    width: 100%;
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 15px;
  }
}
</style>
