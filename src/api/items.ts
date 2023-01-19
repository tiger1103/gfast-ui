// 查询列表
export function getItems(f: Function, query: Object) {
	query = query || { pageSize: 10000 };
	return f(query);
}

export function setItems(response: any, k: string, v: string):Array<ItemOptions> {
	const data: Array<ItemOptions> = [];
	k = k || 'id';
	v = v || 'name';
	if (response.data && response.data.list && response.data.list.length > 0) {
		response.data.list.forEach((e: any) => {
			data.push({
				key: e[k].toString(),
				value: e[v].toString(),
			});
		});
	}
	return data;
}

// 选项类型接口
export interface ItemOptions {
	key:string,
	value:string
}

/** 通过 options 数组获取 key 对应的 value */
export function getOptionValue(key: any, options: Array<any>,keyName:string,valName:string) {
	keyName = keyName??'key'
	valName = valName??'value'
	const option = options.find((value) => {
		return key + '' === value[keyName];
	});
	if (option !== undefined) {
		return option[valName];
	}
}

export function isEmpty(v: any) {
	if (v === '' || v === undefined || v === null) {
		return true;
	}

	if (typeof v === 'object') {
		if (Array.isArray(v)) {
			return v.length === 0;
		} else {
			return Object.keys(v).length === 0;
		}
	}
	return false;
}
