import request from '/@/utils/request';
import {ref ,toRefs,ToRefs} from 'vue'
// 根据字典类型查询字典数据信息
export function getDicts(dictType :string,defaultValue?:string):Promise<any> {
    let dv = defaultValue??''
    let params ={
        dictType:dictType,
        defaultValue:dv
    }
    return request({
        url: '/api/v1/system/dict/data/getDictData',
        method: 'get',
        params:params
    })
}

/**
 * 获取字典数据
 */
export function useDict(...args:string[]):ToRefs<any>{
    const res:any = ref({});
    args.forEach((d:string) => {
        res.value[d] = [];
        getDicts(d).then(resp => {
            res.value[d] = resp.data.values.map((p:any) =>  ({ label: p.value, value: p.key, isDefault: p.isDefault }))
        })
    })
    return toRefs(res.value);
}


export function getDataList(query:Object) {
    return request({
        url: '/api/v1/system/dict/data/list',
        method: 'get',
        params:query
    })
}

export function getData(dictCode:number) {
    return request({
        url: '/api/v1/system/dict/data/get',
        method: 'get',
        params:{dictCode}
    })
}

export function addData(data:any) {
    return request({
        url: '/api/v1/system/dict/data/add',
        method: 'post',
        data:data
    })
}

export function editData(data:any) {
    return request({
        url: '/api/v1/system/dict/data/edit',
        method: 'put',
        data:data
    })
}

export function deleteData(ids:number[]) {
    return request({
        url: '/api/v1/system/dict/data/delete',
        method: 'delete',
        data:{ids}
    })
}
