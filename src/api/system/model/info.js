import request from '@/utils/request'

// 查询模型列表
export function listData(query) {
    return request({
      url: '/system/model/info/list',
      method: 'get',
      params: query
    })
  }


  // 添加
  export function addModel(data) {
    return request({
      url: '/system/model/info/add',
      method: 'post',
      data: data
    })
  }

  
// 查询模型信息
export function getModel(id) {
    return request({
      url: '/system/model/info/edit?id='+id,
      method: 'get',
    })
  }

  
// 修改
export function updateModel(data) {
    return request({
      url: '/system/model/info/edit',
      method: 'post',
      data: data
    })
  }


 // 复制模型
export function copyModel(modelId) {
  return request({
    url: '/system/model/info/copyModel',
    method: 'post',
    data: {modelId:modelId}
  })
}

// 生成模型
export function createModel(modelId) {
  return request({
    url: '/system/model/info/createModel',
    method: 'post',
    data: {modelId:modelId}
  })
}


  // 设置状态
export function changeStatus(id,status) {
    return request({
      url: '/system/model/info/setStatus',
      method: 'post',
      data: {modelId:id,modelStatus:status}
    })
  }

  
// 删除模型列表
export function delModel(data) {
    return request({
      url: '/system/model/info/delete',
      method: 'delete',
      data: {ids:data}
    })
  }
  