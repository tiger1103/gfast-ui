
export interface DeptTreeRow {
    deptId: number;
    parentId: number;
    deptName: string;
    orderNum: number;
    leader: string;
    phone: string;
    email: '';
    status: number;
    createdAt: string;
    children?: DeptTreeRow[];
}

