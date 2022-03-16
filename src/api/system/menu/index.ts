import request from '/@/utils/request';

export function getUserMenus() {
    return request({
        url: '/api/v1/system/getUserMenus',
        method: 'get'
    })
}
