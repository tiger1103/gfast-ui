import request from '/@/utils/request';

export function getRoleList(query:Object) {
    return request({
        url: '/api/v1/system/role/list',
        method: 'get',
        params:query
    })
}
