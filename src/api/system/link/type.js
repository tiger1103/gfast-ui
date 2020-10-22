import request from '@/utils/request'

// 查询友情链接分类列表
export function listType(query) {
  return request({
    url: '/system/plug/link/type/list',
    method: 'get',
    params: query
  })
}

// 查询友情链接分类名列表
export function listNameType() {
  return request({
    url: '/system/plug/link/type/type',
    method: 'get'
  })
}

// 根据id查询友情链接分类
export function getType(linkTypeID) {
  return request({
    url: '/system/plug/link/type/edit?linkTypeID=' + linkTypeID,
    method: 'get'
  })
}

// 新增友情链接分类
export function addType(data) {
  return request({
    url: '/system/plug/link/type/add',
    method: 'post',
    data: data
  })
}

// 修改友情链接分类
export function updateType(data) {
  return request({
    url: '/system/plug/link/type/edit',
    method: 'post',
    data: data
  })
}

// 删除友情链接分类
export function delType(linkTypeID) {
  return request({
    url: '/system/plug/link/type/delete',
    method: 'delete',
    data: {
      linkTypeID:linkTypeID
    }
  })
}

//排序操作
export function sortMenu(params){
  return request({
    url: '/system/plug/link/type/sort',
    method: 'post',
    data:{sorts:params}
  })
}
