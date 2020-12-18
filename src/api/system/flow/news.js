import request from '@/utils/request'

// 查询wfNews列表
export function listWfNews(query) {
  return request({
    url: '/system/wf/news/list',
    method: 'get',
    params: query
  })
}

// 查询wfNews详细
export function getWfNews (id) {
  return request({
    url: '/system/wf/news/edit?id='+id,
    method: 'get'
  })
}

// 查询wfNews详细
export function getCheckLog (query) {
  return request({
    url: '/system/wf/news/checkLog',
    method: 'get',
    params:query
  })
}


// 新增wfNews
export function addWfNews(data) {
  return request({
    url: '/system/wf/news/add',
    method: 'post',
    data: data
  })
}

// 修改wfNews
export function updateWfNews(data) {
  return request({
    url: '/system/wf/news/edit',
    method: 'post',
    data: data
  })
}

// 删除wfNews
export function delWfNews(ids) {
  return request({
    url: '/system/wf/news/delete',
    method: 'delete',
    data:{ids:ids}
  })
}
