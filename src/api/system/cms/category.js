import request from '@/utils/request'

// 查询栏目列表
export function list(query) {
    return request({
      url: '/system/cms/menu/list',
      method: 'get',
      params: query
    })
  }

  //添加页获取父级栏目
  export function treeselect(){
    return request({
        url: '/system/cms/menu/add',
        method: 'get'
      })
  }

  //栏目排序操作
  export function sortMenu(params){
    return request({
      url: '/system/cms/menu/sort',
      method: 'post',
      params:{sorts:params}
    })
  }

//添加栏目操作
  export function addMenu(params){
    return request({
      url: '/system/cms/menu/add',
      method: 'post',
      params:params
    })
  }

  //获取修改的数据
  export function getMenu(id){
    return request({
      url: '/system/cms/menu/edit?id='+id,
      method: 'get'
    })
  }

  //修改保存
  export function updateMenu(data){
    return request({
      url :'/system/cms/menu/edit',
      method:'post',
      params:data
    })
  }

//删除栏目
export function delMenu(cateId){
  return request({
    url:'/system/cms/menu/delete',
    method:'delete',
    data:{ids:cateId}
  })
}