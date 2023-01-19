import request from '/@/utils/request';

export function getTypeList(query:Object) {
    return request({
        url: '/api/v1/system/dict/type/list',
        method: 'get',
        params:query
    })
}

export function getType(dictId:number) {
    return request({
        url: '/api/v1/system/dict/type/get',
        method: 'get',
        params:{dictId}
    })
}

export function addType(data:any) {
    return request({
        url: '/api/v1/system/dict/type/add',
        method: 'post',
        data:data
    })
}

export function editType(data:any) {
    return request({
        url: '/api/v1/system/dict/type/edit',
        method: 'put',
        data:data
    })
}


export function deleteType(dictIds:number[]) {
    return request({
        url: '/api/v1/system/dict/type/delete',
        method: 'delete',
        data:{dictIds}
    })
}


// 获取字典选择框列表
export function optionselect() {
    return request({
        url: '/api/v1/system/dict/type/optionSelect',
        method: 'get'
    })
}

