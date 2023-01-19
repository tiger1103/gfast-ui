import request from '/@/utils/request';

export function getPostList(query:Object) {
    return request({
        url: '/api/v1/system/post/list',
        method: 'get',
        params:query
    })
}

export function addPost(data:object) {
    return request({
        url: '/api/v1/system/post/add',
        method: 'post',
        data:data
    })
}


export function editPost(data:object) {
    return request({
        url: '/api/v1/system/post/edit',
        method: 'put',
        data:data
    })
}


export function deletePost(ids:number[]) {
    return request({
        url: '/api/v1/system/post/delete',
        method: 'delete',
        data:{ids}
    })
}
