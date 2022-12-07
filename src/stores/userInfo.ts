import { defineStore } from 'pinia';
import { UserInfosStates,UserInfosState } from './interface';
import { Session } from '/@/utils/storage';

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfo = defineStore('userInfo', {
	state: (): UserInfosStates => ({
		userInfos: {
			id:0,
			avatar: '',
			userName: '',
			photo: '',
			time: 0,
			roles: [],
			authBtnList: [],
		},
		permissions:[],
	}),
	actions: {
		async setUserInfos(data?: UserInfosState|null) {
			if (data) {
				this.userInfos=data
			} else {
				if (Session.get('userInfo')) {
					this.userInfos=Session.get('userInfo')
				}
			}
		},
		async setPermissions( data?: string[]) {
			if (data) {
				this.permissions=data
			} else {
				if (Session.get('permissions')){
					this.permissions=Session.get('permissions')
				} 
			}
		},
	},
});
