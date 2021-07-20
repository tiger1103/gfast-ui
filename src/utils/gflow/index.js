/**
 * Date:2020/4/15
 * Desc:
 */

//
export function uuid() {
// return (+new Date() * 1e6 + Math.floor(Math.random() * 1e6)).toString(36);
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0;
        var v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
}

//
export function clone(obj) {
    let result = '';
    //
    if (typeof obj === 'object') {
        result = JSON.stringify(obj);
        result = JSON.parse(result);
    } else {
        result = obj;
    }

    return result;
}
