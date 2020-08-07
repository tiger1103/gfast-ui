import request from '@/utils/request'

// 查询站点信息
export function getInfo() {
    return request({
      url: '/system/config/webSet/getInfo',
      method: 'get'
    })
  }
  
// 更新站点信息
export function updateInfo(data) {
    return request({
      url: '/system/config/webSet/update',
      method: 'post',
      data: {webContent:data}
    })
  }