import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/config/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/config/dict/data/one?dictCode=' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType,defaultValue) {
  defaultValue = defaultValue || ''
  let params ={
    dictType:dictType,
    defaultValue:defaultValue
  }
  return request({
    url: '/system/config/dict/data/GetDictData',
    method: 'get',
    params:params
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/config/dict/data/add',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/config/dict/data/edit',
    method: 'put',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/config/dict/data/delete',
    method: 'delete',
    data:{ids:dictCode}
  })
}

// 导出字典数据
export function exportData(query) {
  return request({
    url: '/system/dict/data/export',
    method: 'get',
    params: query
  })
}
