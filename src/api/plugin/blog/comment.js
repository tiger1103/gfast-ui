import request from '@/utils/request'

// 查询列表
export function listInfo(query) {
  return request({
    url: '/system/plugin/blog/comment/list',
    method: 'get',
    params: query
  })
}

// 根据id查询评论
export function getInfo(commentId) {
  return request({
    url: '/system/plugin/blog/comment/edit?commentId=' + commentId,
    method: 'get'
  })
}

// 修改
export function updateInfo(data) {
  return request({
    url: '/system/plugin/blog/comment/edit',
    method: 'post',
    data: data
  })
}

// 删除留言
export function delInfo(commentId) {
  return request({
    url: '/system/plugin/blog/comment/delete',
    method: 'delete',
    data: {
      commentId:commentId
    }
  })
}
