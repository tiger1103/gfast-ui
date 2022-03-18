import request from '/@/utils/request';
import {ref ,toRefs} from 'vue'
// 根据字典类型查询字典数据信息
export function getDicts(dictType :string,...defaultValue:string[]):Promise<any> {
    let dv = defaultValue.length>0?defaultValue[0]:''
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
export function useDict(...args:Array<string>) {
    const res:any = ref({});
    return (() => {
        args.forEach((d:string) => {
            res.value[d] = [];
            getDicts(d).then(resp => {
                res.value[d] = resp.data.map((p:any) => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass }))
            })
        })
        return toRefs(res.value);
    })()
}
