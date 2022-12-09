
export interface SysMenuItem {
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
    children:  SysMenuItem[];
}
