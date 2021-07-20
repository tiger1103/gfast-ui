import request from '@/utils/request'

// 查询操作日志列表
export function list(query) {
  return request({
    url: '/system/monitor/operLog/list',
    method: 'get',
    params: query
  })
}

// 删除操作日志
export function delOperlog(operId) {
  return request({
    url: '/system/monitor/operLog/delete',
    method: 'delete',
    data:{
      ids: operId
    }
  })
}

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/system/monitor/operLog/clear',
    method: 'delete'
  })
}

// 导出操作日志
export function exportOperlog(query) {
  return request({
    url: '/monitor/operlog/export',
    method: 'get',
    params: query
  })
}
