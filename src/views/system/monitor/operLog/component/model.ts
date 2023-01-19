export interface SysOperLogTableColumns {
    operId:number;  // 日志编号
    title:string;  // 系统模块
    requestMethod:string;  // 请求方式
    operName:string;  // 操作人员
    deptName:string;  // 部门名称
    operUrl:string;  // 请求URL
    operIp:string;  // 主机地址
    operLocation:string;  // 操作地点
    operParam:string;  // 请求参数
    status:number;  // 操作状态（0正常 1异常）
    operTime:string;  // 操作时间
    linkedSysOperLogSysDept:LinkedSysOperLogSysDept;
}


export interface SysOperLogInfoData {
    operId:number|undefined;        // 日志编号
    title:string|undefined; // 系统模块
    businessType:number|undefined; // 操作类型
    method:string|undefined; // 操作方法
    requestMethod:string|undefined; // 请求方式
    operatorType:number|undefined; // 操作类别
    operName:string|undefined; // 操作人员
    deptName:string|undefined; // 部门名称
    operUrl:string|undefined; // 请求URL
    operIp:string|undefined; // 主机地址
    operLocation:string|undefined; // 操作地点
    operParam:string|undefined; // 请求参数
    jsonResult:string|undefined; // 返回参数
    status:boolean; // 操作状态（0正常 1异常）
    errorMsg:string|undefined; // 错误消息
    operTime:string|undefined; // 操作时间
    linkedSysOperLogSysDept:LinkedSysOperLogSysDept;
}


export interface LinkedSysOperLogSysDept {
    deptId:number|undefined;    // 部门id
    deptName:string|undefined;    // 部门名称
}


export interface SysOperLogTableDataState {
    operIds:any[];
    tableData: {
        data: Array<SysOperLogTableColumns>;
        total: number;
        loading: boolean;
        param: {
            pageNum: number;
            pageSize: number;
            title: string|undefined;
            requestMethod: string|undefined;
            operName: string|undefined;
            status: number|undefined;
            dateRange: string[];
        };
    };
}


export interface SysOperLogEditState{
    loading:boolean;
    isShowDialog: boolean;
    formData:SysOperLogInfoData;
    rules: object;
}
