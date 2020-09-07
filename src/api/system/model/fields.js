import request from '@/utils/request'


  // 添加
  export function addFields(data) {
    return request({
      url: '/system/model/fields/add',
      method: 'post',
      data: data
    })
  }

  // 查询模型列表
export function fieldsList(modelId) {
    return request({
      url: '/system/model/fields/list',
      method: 'get',
      params:{modelId:modelId}
    })
  }

  // 修改字段属性
  export function setFieldsAttr(fieldsList,pkId,modelId) {
    return request({
      url: '/system/model/fields/setFieldsAttr',
      method: 'post',
      data: {fieldsList:fieldsList,pkId:pkId,modelId:modelId}
    })
  }

  
// 查询字段信息
export function getField(id) {
    return request({
      url: '/system/model/fields/edit?id='+id,
      method: 'get',
    })
  }

  
// 修改
export function updateFeild(data) {
    return request({
      url: '/system/model/fields/edit',
      method: 'post',
      data: data
    })
  }

  
// 删除字段
export function delField(data) {
    return request({
      url: '/system/model/fields/delete',
      method: 'delete',
      data: {ids:data}
    })
  }
  
