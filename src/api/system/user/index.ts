import request from '/@/utils/request';

export function getUserList(query:Object) {
    return request({
        url: '/api/v1/system/user/list',
        method: 'get',
        params:query
    })
}
