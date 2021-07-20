import request from '@/utils/request'

// 查询模型分类列表
export function listData(query) {
    return request({
      url: '/system/model/category/list',
      method: 'get',
      params: query
    })
  }

  // 查询模型分类
export function getCategoryAll() {
  return request({
    url: '/system/model/category/all',
    method: 'get'
  })
}


  // 添加
export function addCategory(data) {
  return request({
    url: '/system/model/category/add',
    method: 'post',
    data: data
  })
}


// 查询模型分类信息
export function getCategory(id) {
  return request({
    url: '/system/model/category/edit?id='+id,
    method: 'get',
  })
}


// 查询模型分类列表
export function sortCategory(data) {
  return request({
    url: '/system/model/category/sort',
    method: 'post',
    data: {sorts:data}
  })
}


// 删除模型分类列表
export function delCategory(data) {
  return request({
    url: '/system/model/category/delete',
    method: 'delete',
    data: {ids:data}
  })
}

// 修改
export function updateCategory(data) {
  return request({
    url: '/system/model/category/edit',
    method: 'post',
    data: data
  })
}