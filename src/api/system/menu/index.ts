import request from '/@/utils/request';

export function getUserMenus() {
    return request({
        url: '/api/v1/system/user/getUserMenus',
        method: 'get'
    })
}

export function getMenuParams() {
    return request({
        url: '/api/v1/system/menu/getParams',
        method: 'get'
    })
}

export function addMenu(data:Object) {
    return request({
        url: '/api/v1/system/menu/add',
        method: 'post',
        data:data
    })
}


