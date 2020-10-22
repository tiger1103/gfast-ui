import request from '@/utils/request'

// 查询广告列表
export function listInfo(query) {
  return request({
    url: '/system/plug/ad/info/list',
    method: 'get',
    params: query
  })
}

// 根据id查询广告
export function getInfo(plugAdID) {
  return request({
    url: '/system/plug/ad/info/edit?plugAdID=' + plugAdID,
    method: 'get'
  })
}

// 新增广告
export function addInfo(data) {
  return request({
    url: '/system/plug/ad/info/add',
    method: 'post',
    data: data
  })
}

// 修改广告
export function updateInfo(data) {
  return request({
    url: '/system/plug/ad/info/edit',
    method: 'post',
    data: data
  })
}

// 删除广告
export function delInfo(plugAdID) {
  return request({
    url: '/system/plug/ad/info/delete',
    method: 'delete',
    data: {
        plugAdID:plugAdID
    }
  })
}

//排序操作
export function sortMenu(params){
  return request({
    url: '/system/plug/ad/info/sort',
    method: 'post',
    data:{sorts:params}
  })
}
