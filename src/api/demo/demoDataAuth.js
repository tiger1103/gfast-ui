import request from '@/utils/request'
// 查询数据权限测试列表
export function listDemoDataAuth(query) {
  return request({
    url: '/demo/demoDataAuth/list',
    method: 'get',
    params: query
  })
}
// 查询数据权限测试详细
export function getDemoDataAuth(id) {
  return request({
    url: '/demo/demoDataAuth/get',
    method: 'get',
    params: {
     id: id.toString()
    }
  })
}
// 新增数据权限测试
export function addDemoDataAuth(data) {
  return request({
    url: '/demo/demoDataAuth/add',
    method: 'post',
    data: data
  })
}
// 修改数据权限测试
export function updateDemoDataAuth(data) {
  return request({
    url: '/demo/demoDataAuth/edit',
    method: 'put',
    data: data
  })
}
// 删除数据权限测试
export function delDemoDataAuth(ids) {
  return request({
    url: '/demo/demoDataAuth/delete',
    method: 'delete',
    data:{
       ids:ids
    }
  })
}
//获取用户信息列表
export function getUserList(uIds){
    return request({
     url: '/system/auth/usersGet',
     method: 'get',
     params: {ids:uIds}
   })
}
