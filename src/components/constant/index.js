/*
* date: 2020-01-17
* desc:
*/


export const FLOW_TYPE = {
    action: 'action',
    condition: 'condition',
    flow: 'flow',
    temp: 'temp',
};

export const FLOW_ITEM_TYPE = {
    startNode: 'startNode',
    endNode: 'endNode',
    waitNode: 'waitNode',
    tempNode: 'tempNode',
    nodeNode: 'nodeNode',
    ifNode: 'ifNode',
    expandNode: 'expandNode',
    list: 'list'
};


export const FLOW_LIST = {
    action: [
        {
            id: 'nodeNode',
            type: 'nodeNode',
            className: 'step-tag',
            name: '节点',
            groupType: 'action',
        }
    ],
    // 条件控制
    condition: [
        {
            id: 'conditionNode',
            type: 'ifNode',
            className: 'step-if',
            name: '条件判断',
            groupType: 'condition',
        },
        {
            id: 'switchNode',
            type: 'expandNode',
            className: 'step-expand',
            name: '条件分组',
            groupType: 'condition',
        }
    ],
    // 流程控制
    flow: [
        {
            id: 'startNode',
            type: 'startNode',
            className: 'step-start',
            name: 'start',
            groupType: 'flow',
            hidden: true
        },
        {
            id: 'stopNode',
            type: 'endNode',
            className: 'step-end',
            name: '结束',
            groupType: 'flow',
        }
    ],
};

export const FLOW_ALL_LIST = [
    {
        type: FLOW_TYPE.action,
        ref: 'actionFlow',
        children: FLOW_LIST.action
    },
    {
        type: FLOW_TYPE.flow,
        ref: 'flowFlow',
        children: FLOW_LIST.flow
    },
    {
        type: FLOW_TYPE.condition,
        ref: 'conditionFlow',
        children: FLOW_LIST.condition
    },
];
