import request from '/@/utils/request'
// 查询操作日志列表
export function listSysOperLog(query:object) {
    return request({
        url: '/api/v1/system/operLog/list',
        method: 'get',
        params: query
    })
}
// 查询操作日志详细
export function getSysOperLog(operId:number) {
    return request({
        url: '/api/v1/system/operLog/get',
        method: 'get',
        params: {
            operId: operId.toString()
        }
    })
}
// 删除操作日志
export function delSysOperLog(operIds:number[]) {
    return request({
        url: '/api/v1/system/operLog/delete',
        method: 'delete',
        data:{
            operIds:operIds
        }
    })
}


export function clearOperLog() {
    return request({
        url: '/api/v1/system/operLog/clear',
        method: 'delete',
    })
}
