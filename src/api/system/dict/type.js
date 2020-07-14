import request from '@/utils/request'

// 查询字典类型列表
export function listType(query) {
  return request({
    url: '/system/config/dict/list',
    method: 'get',
    params: query
  })
}

// 查询字典类型详细
export function getType(dictId) {
  return request({
    url: '/system/config/dict/edit?dictId=' + dictId,
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/system/config/dict/add',
    method: 'post',
    data: data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/system/config/dict/edit',
    method: 'post',
    data: data
  })
}


// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/system/config/dict/optionSelect',
    method: 'get'
  })
}

// 删除字典类型
export function delType(dictId) {
  return request({
    url: "/system/config/dict/delete",
    method: 'delete',
    data:{dictIds:dictId}
  })
}

// 导出字典类型
export function exportType(query) {
  return request({
    url: '/system/dict/type/export',
    method: 'get',
    params: query
  })
}
