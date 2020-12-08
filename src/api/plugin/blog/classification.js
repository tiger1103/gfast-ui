import request from '@/utils/request'

// 查询分类列表
export function listInfo(query) {
  return request({
    url: '/system/plugin/blog/classification/list',
    method: 'get',
    params: query
  })
}

// 查询分类名称列表
export function listNameInfo() {
  return request({
    url: '/system/plugin/blog/classification/type',
    method: 'get'
  })
}

// 根据id查询
export function getInfo(classificationId) {
  return request({
    url: '/system/plugin/blog/classification/edit?classificationId=' + classificationId,
    method: 'get'
  })
}

// 新增
export function addInfo(data) {
  return request({
    url: '/system/plugin/blog/classification/add',
    method: 'post',
    data: data
  })
}

// 修改
export function updateInfo(data) {
  return request({
    url: '/system/plugin/blog/classification/edit',
    method: 'post',
    data: data
  })
}

// 删除
export function delInfo(classificationId) {
  return request({
    url: '/system/plugin/blog/classification/delete',
    method: 'delete',
    data: {
      classificationId:classificationId
    }
  })
}

//添加页获取父级栏目
export function treeselect(){
  return request({
    url: '/system/plugin/blog/classification/add',
    method: 'get'
  })
}

//排序操作
export function sortMenu(params){
  return request({
    url: '/system/plugin/blog/classification/sort',
    method: 'post',
    data:{sorts:params}
  })
}
