import request from '@/utils/request'

// 查询列表
export function listInfo(query) {
  return request({
    url: '/system/plugin/blog/log/list',
    method: 'get',
    params: query
  })
}

// 根据id查询
export function getInfo(logID) {
  return request({
    url: '/system/plugin/blog/log/edit?logID=' + logID,
    method: 'get'
  })
}

// 新增
export function addInfo(data) {
  return request({
    url: '/system/plugin/blog/log/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateInfo(data) {
  return request({
    url: '/system/plugin/blog/log/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function delInfo(logID) {
  return request({
    url: '/system/plugin/blog/log/delete',
    method: 'delete',
    data: {
      logID:logID
    }
  })
}

//排序操作
export function sortMenu(params){
  return request({
    url: '/system/plugin/blog/log/sort',
    method: 'post',
    data:{sorts:params}
  })
}
