import request from '/@/utils/request';

export function getDeptList(query:Object) {
    return request({
        url: '/api/v1/system/dept/list',
        method: 'get',
        params:query
    })
}


export function addDept(data:object) {
    return request({
        url: '/api/v1/system/dept/add',
        method: 'post',
        data:data
    })
}
