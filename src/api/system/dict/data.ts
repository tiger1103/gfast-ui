import request from '/@/utils/request';
import {ref ,toRefs} from 'vue'
import {ToRefs} from "_@vue_reactivity@3.2.31@@vue/reactivity";
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
export function useDict(...args:string[]): ToRefs{
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
