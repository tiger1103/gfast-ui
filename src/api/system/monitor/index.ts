import request from '/@/utils/request';


export function getSysInfo() {
    return request({
        url: '/api/v1/system/monitor/server',
        method: 'get'
    })
}
