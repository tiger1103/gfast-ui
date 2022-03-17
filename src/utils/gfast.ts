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
