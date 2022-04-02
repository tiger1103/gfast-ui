import request from '/@/utils/request';

export function getRoleList(query:Object) {
    return request({
        url: '/api/v1/system/role/list',
        method: 'get',
        params:query
    })
}

export function getRoleParams() {
    return request({
        url: '/api/v1/system/role/getParams',
        method: 'get'
    })
}

export function addRole(data:object) {
    return request({
        url: '/api/v1/system/role/add',
        method: 'put',
        data:data
    })
}

