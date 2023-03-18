
export interface SysDictDataMap{
    [key: string]: SysDictDataMapItem[]
}

/**
 * 经过转化的字典数据项
 */
export interface SysDictDataMapItem {
    label: string
    value: string
    isDefault: number
}