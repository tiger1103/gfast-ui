import request from '/@/utils/request';

// 是否已初始化
export function isInit() {
    return request({
        url: '/api/v1/system/dbInit/isInit',
        method: 'get'
    })
}


// 获取环境信息
export function getEnvInfo() {
    return request({
        url: '/api/v1/system/dbInit/getEnvInfo',
        method: 'get'
    })
}

// 创建数据库
export function createDb (data:object) {
    return request({
        url: '/api/v1/system/dbInit/createDb',
        method: 'post',
        data: data
    })
}
