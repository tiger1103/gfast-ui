import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/system/monitor/loginlog/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLogininfor(infoId) {
  return request({
    url: '/system/monitor/loginlog/delete',
    method: 'post',
    data:{
      ids:infoId
    }
  })
}

// 清空登录日志
export function cleanLogininfor() {
  return request({
    url: '/system/monitor/loginlog/clear',
    method: 'delete'
  })
}

// 导出登录日志
export function exportLogininfor(query) {
  return request({
    url: '/monitor/logininfor/export',
    method: 'get',
    params: query
  })
}