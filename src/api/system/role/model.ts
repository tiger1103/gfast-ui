export interface RoleListItem {
    id:        number;
    status:    number;
    listOrder: number;
    name:      string;
    remark:    string;
    dataScope: number;
    createdAt: string;
    updatedAt: string;
}

export interface RoleParamMenuItem {
    id:        number;
    pid:       number;
    name:      string;
    title:     string;
    icon:      string;
    condition: string;
    remark:    string;
    menuType:  number;
    weigh:     number;
    isHide:    number;
    isCached:  number;
    isAffix:   number;
    path:      string;
    redirect:  string;
    component: string;
    isIframe:  number;
    isLink:    number;
    linkUrl:   string;
}