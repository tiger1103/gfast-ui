import request from '@/utils/request'

// 查询广告位列表
export function listType(query) {
  return request({
    url: '/system/plug/ad/type/list',
    method: 'get',
    params: query
  })
}

// 查询广告位名列表
export function listNameType() {
  return request({
    url: '/system/plug/ad/type/type',
    method: 'get'
  })
}

// 根据id查询广告位
export function getType(adTypeID) {
  return request({
    url: '/system/plug/ad/type/edit?adTypeID=' + adTypeID,
    method: 'get'
  })
}

// 新增广告位
export function addType(data) {
  return request({
    url: '/system/plug/ad/type/add',
    method: 'post',
    data: data
  })
}

// 修改广告位
export function updateType(data) {
  return request({
    url: '/system/plug/ad/type/edit',
    method: 'post',
    data: data
  })
}

// 删除广告位
export function delType(adTypeID) {
  return request({
    url: '/system/plug/ad/type/delete',
    method: 'delete',
    data: {
      adTypeID:adTypeID
    }
  })
}

//排序操作
export function sortMenu(params){
  return request({
    url: '/system/plug/ad/type/sort',
    method: 'post',
    data:{sorts:params}
  })
}
