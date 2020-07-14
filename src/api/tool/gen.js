import request from '@/utils/request'

// 查询生成表数据
export function listTable(query) {
  return request({
    url: '/system/tools/gen/tableList',
    method: 'get',
    params: query
  })
}
// 查询db数据库列表
export function listDbTable(query) {
  return request({
    url: '/system/tools/gen/dataList',
    method: 'get',
    params: query
  })
}

// 查询表详细信息
export function getGenTable(tableId) {
  return request({
    url: '/system/tools/gen/columnList?tableId=' + tableId,
    method: 'get'
  })
}

// 修改代码生成信息
export function updateGenTable(data) {
  return request({
    url: '/system/tools/gen/editSave',
    method: 'put',
    data: data
  })
}

// 导入表
export function importTable(data) {
  return request({
    url: '/system/tools/gen/importTableSave',
    method: 'post',
    params: data
  })
}
// 预览生成代码
export function previewTable(tableId) {
  return request({
    url: '/system/tools/gen/preview?tableId=' + tableId,
    method: 'get'
  })
}
// 删除表数据
export function delTable(tableId) {
  return request({
    url: '/system/tools/gen/delete',
    method: 'delete',
    data:{ids:tableId}
  })
}

