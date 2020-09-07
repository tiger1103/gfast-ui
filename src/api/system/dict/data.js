import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/system/config/dict/dataList',
    method: 'get',
    params: query
  })
}

// 查询字典数据详细
export function getData(dictCode) {
  return request({
    url: '/system/config/dict/dataEdit/?dictCode=' + dictCode,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
  return request({
    url: '/system/config/dict/getDicts?dictType=' + dictType,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/system/config/dict/dataAdd',
    method: 'post',
    data: data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/system/config/dict/dataEdit',
    method: 'post',
    data: data
  })
}

// 删除字典数据
export function delData(dictCode) {
  return request({
    url: '/system/config/dict/dataDelete',
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
