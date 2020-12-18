import request from '@/utils/request'

// 查询flow列表
export function listFlow(query) {
  return request({
    url: '/system/wf/flow/list',
    method: 'get',
    params: query
  })
}

// 查询flow详细
export function getFlow (id) {
  return request({
    url: '/system/wf/flow/edit?id='+id,
    method: 'get'
  })
}


// 新增flow
export function addFlow(data) {
  return request({
    url: '/system/wf/flow/add',
    method: 'post',
    data: data
  })
}

// 修改flow
export function updateFlow(data) {
  return request({
    url: '/system/wf/flow/edit',
    method: 'post',
    data: data
  })
}

// 删除flow
export function delFlow(ids) {
  return request({
    url: '/system/wf/flow/delete',
    method: 'delete',
    data:{ids:ids}
  })
}


export function statusSetFlow(data){
  return request({
    url: '/system/wf/flow/statusSetFlow',
    method: 'post',
    data:data
  })
}

export function getProcess(id){
  return request({
    url: '/system/wf/flow/designFlow?id='+id,
    method: 'get',
  })
}

export function addProcess(id){
  return request({
    url: '/system/wf/flow/addProcess',
    method: 'post',
    data:{id:id}
  })
}

export function saveProcess(data){
  return request({
    url: '/system/wf/flow/saveProcess',
    method: 'post',
    data:{data:data}
  })
}

export function getManager(data){
  return request({
    url: '/system/wf/flow/getManager',
    method: 'post',
    data:data
  })
}

export function doSaveAttr(data){
  return request({
    url: '/system/wf/flow/saveAttr',
    method: 'post',
    data:data
  })
}

export function deleteFlowNode(data){
  return request({
    url: '/system/wf/flow/deleteProcess',
    method: 'delete',
    data:data
  })
}


export function clearAllNodes(data){
  return request({
    url: '/system/wf/flow/deleteProcessAll',
    method: 'delete',
    data:data
  })
}


export function checkFlow(query){
  return request({
    url: '/system/wf/flow/checkFlow',
    method: 'get',
    params:query
  })
}

//发起流程
export function wfStart(query){
  return request({
    url: '/system/wf/flow/wfStart',
    method: 'get',
    params:query
  })
}


//保存发起流程信息
export function saveStartWf(data){
  return request({
    url: '/system/wf/flow/saveStartWf',
    method: 'post',
    params:data
  })
}

//流程审批
export function wfCheck(query){
  return request({
    url: '/system/wf/flow/wfCheck',
    method: 'get',
    params:query
  })
}

//保存审批信息
export function saveCheckWf(data){
  return request({
    url: '/system/wf/flow/checkSave',
    method: 'post',
    data:data
  })
}


//发起流程
export function backTodo(query){
  return request({
    url: '/system/wf/flow/getBackTodo',
    method: 'get',
    params:query
  })
}

// 查询flow列表
export function monitoring(query) {
  return request({
    url: '/system/wf/flow/monitoring',
    method: 'get',
    params: query
  })
}

// 终止流程
export function stopFlow(data) {
  return request({
    url: '/system/wf/flow/stopFlow',
    method: 'put',
    data:data
  })
}
