import request from '/@/utils/request';

export function getTypeList(query:Object) {
    return request({
        url: '/api/v1/system/dict/type/list',
        method: 'get',
        params:query
    })
}
