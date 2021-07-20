import request from '@/utils/request'

// 查询站点信息
export function getInfo() {
    return request({
      url: '/system/config/sysWebSet',
      method: 'get'
    })
  }

// 更新站点信息
export function updateInfo(data) {
    return request({
      url: '/system/config/sysWebSet/update',
      method: 'post',
      data: {webId:data.webId,webContent:data}
    })
  }
