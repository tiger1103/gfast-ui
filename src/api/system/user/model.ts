export interface UserListItem {
    id:            number;
    userName:      string;
    mobile:        string;
    userNickname:  string;
    birthday:      number;
    userPassword:  string;
    userSalt:      string;
    userStatus:    number;
    userEmail:     string;
    sex:           number;
    avatar:        string;
    deptId:        number;
    remark:        string;
    isAdmin:       number;
    address:       string;
    describe:      string;
    lastLoginIp:   string;
    lastLoginTime: string;
    createdAt:     string;
    updatedAt:     string;
    deletedAt:     string;
    dept:          Dept;
    roleInfo:      RoleInfo[];
    post:          Post[];
}

export interface Dept {
    deptId:    number;
    parentId:  number;
    ancestors: string;
    deptName:  string;
    orderNum:  number;
    leader:    string;
    phone:     string;
    email:     string;
    status:    number;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface Post {
    postId:   number;
    postName: string;
}

export interface RoleInfo {
    roleId: number;
    name:   string;
}


export interface UserParamsRes {
    roleList: RoleParamItem[];
    posts:    PostParamItem[];
}

export interface PostParamItem {
    postId:    number;
    postCode:  string;
    postName:  string;
    postSort:  number;
    status:    number;
    remark:    string;
    createdBy: number;
    updatedBy: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
}

export interface RoleParamItem {
    id:        number;
    status:    number;
    listOrder: number;
    name:      string;
    remark:    string;
    dataScope: number;
    createdAt: string;
    updatedAt: string;
}