import type { App } from 'vue';
import { store } from '/@/store/index.ts';
import { judementSameArr } from '/@/utils/arrayOperation';

/**
 * 用户权限指令
 * @directive 单个权限验证（v-auth="xxx"）
 * @directive 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
 * @directive 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
 */
export function authDirective(app: App) {
	const allPermissions = "*/*/*"
	// 单个权限验证（v-auth="xxx"）
	app.directive('auth', {
		mounted(el, binding) {
			if (store.state.userInfos.permissions.includes(allPermissions)) return
			if (!store.state.userInfos.permissions.some((v: string) => v === binding.value)) el.parentNode.removeChild(el);
		},
	});
	// 多个权限验证，满足一个则显示（v-auths="[xxx,xxx]"）
	app.directive('auths', {
		mounted(el, binding) {
			if (store.state.userInfos.permissions.includes(allPermissions)) return
			let flag = false;
			store.state.userInfos.permissions.map((val: string) => {
				binding.value.map((v: string) => {
					if (val === v) flag = true;
				});
			});
			if (!flag) el.parentNode.removeChild(el);
		},
	});
	// 多个权限验证，全部满足则显示（v-auth-all="[xxx,xxx]"）
	app.directive('auth-all', {
		mounted(el, binding) {
			if (store.state.userInfos.permissions.includes(allPermissions)) return
			const flag = judementSameArr(binding.value, store.state.userInfos.permissions);
			if (!flag) el.parentNode.removeChild(el);
		},
	});
}
