import request from '@/utils/request'
// 查询插件管理列表
export function listPluginsManage(query) {
  return request({
    url: '/system/pluginsManage/list',
    method: 'get',
    params: query
  })
}
// 查询插件管理详细
export function getPluginsManage(id) {
  return request({
    url: '/system/pluginsManage/get',
    method: 'get',
    params: {
     id: id.toString()
    }
  })
}

export function unInstallPlugin(){

}

// 安装插件
export function installPlugin(pluginId,version,rToken) {
  return request({
    url: '/system/pluginsManage/install',
    method: 'post',
    data: {pluginId,version,rToken}
  })
}

// 插件管理状态修改
export function changePluginsManageStatus(pluginId,status) {
  const data = {
    pluginId,
    status
  }
  return request({
    url: '/system/pluginsManage/changeStatus',
    method: 'put',
    data:data
  })
}


// 获取验证码
export function getCodeImgR() {
  return request({
    url: '/system/pluginsManage/captcha',
    method: 'get'
  })
}

// 登录服务
export function loginR(data){
  return request({
    url: '/system/pluginsManage/loginR',
    method: 'POST',
    data:data
  })
}
