import {Session} from "/@/utils/storage";

/**
 * 通用js方法封装处理
 * Copyright (c) 2022 gfast
 */

export const baseURL:string|undefined|boolean = import.meta.env.VITE_API_URL


export function getUpFileUrl(url:string){
    if(!url){
        return url
    }
    if (/^http|^blob/i.test(url)) {
        return url
    }
    let reg = new RegExp('^/*' + baseURL + "/*");
    return baseURL+url.replace(reg,'')
}



/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data:any[], id:string, parentId:string, children:string, rootId:number):any[] {
    id = id || 'id'
    parentId = parentId || 'parentId'
    children = children || 'children'
    rootId = rootId || 0
    //对源数据深度克隆
    const cloneData = JSON.parse(JSON.stringify(data))
    //循环所有项
    const treeData =  cloneData.filter((father:any) => {
        let branchArr = cloneData.filter((child:any) => {
            //返回每一项的子级数组
            return father[id] === child[parentId]
        });
        branchArr.length > 0 ? father[children] = branchArr : '';
        //返回第一层
        return father[parentId] === rootId;
    });
    return treeData != '' ? treeData : data;
}


// 回显数据字典
export function selectDictLabel(data:any[], value:string):string {
    let actions:string[]=[]
    data.map((item) => {
        if (item.value == value) {
            actions.push(item.label);
            return false;
        }
    })
    return actions.join('');
}

export function getToken():string{
    return Session.get('token')
}

// 日期格式化
export function parseTime(time:any, pattern:string) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/');
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj:any = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}
