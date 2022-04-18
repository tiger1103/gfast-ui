/**
 * 通用js方法封装处理
 * Copyright (c) 2022 gfast
 */

const baseURL:string|undefined|boolean = import.meta.env.VITE_API_URL


export function getUpFileUrl(url:string){
    if(!url){
        return url
    }
    if (/^http|^blob/i.test(url)) {
        return url
    }
    let reg = new RegExp('^/*' + baseURL + "/*");
    return baseURL+"/"+url.replace(reg,'')
}



/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data:[], id:string, parentId:string, children:string, rootId:number) {
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
        branchArr.length > 0 ? father.children = branchArr : '';
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
