import request from '@/utils/request'

// 查询友情链接列表
export function listInfo(query) {
  return request({
    url: '/system/plug/link/info/list',
    method: 'get',
    params: query
  })
}

// 根据id查询友情链接
export function getInfo(plugLinkID) {
  return request({
    url: '/system/plug/link/info/edit?plugLinkID=' + plugLinkID,
    method: 'get'
  })
}

// 新增友情链接
export function addInfo(data) {
  return request({
    url: '/system/plug/link/info/add',
    method: 'post',
    data: data
  })
}

// 修改友情链接
export function updateInfo(data) {
  return request({
    url: '/system/plug/link/info/edit',
    method: 'post',
    data: data
  })
}

// 删除友情链接
export function delInfo(plugLinkID) {
  return request({
    url: '/system/plug/link/info/delete',
    method: 'delete',
    data: {
      plugLinkID:plugLinkID
    }
  })
}

//排序操作
export function sortMenu(params){
  return request({
    url: '/system/plug/link/info/sort',
    method: 'post',
    data:{sorts:params}
  })
}
