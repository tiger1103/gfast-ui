import { Module } from 'vuex';
import { Session } from '/@/utils/storage';
import {UserInfosState, RootStateTypes} from '/@/store/interface/index';

const userInfosModule: Module<UserInfosState, RootStateTypes> = {
	namespaced: true,
	state: {
		userInfos: {
			id:0,
			userName: '',
			userNickname:'',
			avatar: '',
			roles: [],
			time: 0
		},
		permissions:[],
	},
	mutations: {
		// 设置用户信息
		getUserInfos(state, data: any) {
			state.userInfos = data;
		},
		// 设置按钮权限
		getPermissions(state, data: any) {
			state.permissions = data;
		},
	},
	actions: {
		// 设置用户信息
		async setUserInfos({ commit }, data: UserInfosState) {
			if (data) {
				commit('getUserInfos', data);
			} else {
				if (Session.get('userInfo')) commit('getUserInfos', Session.get('userInfo'));
			}
		},
		async setPermissions({ commit }, data: string[]) {
			if (data) {
				commit('getPermissions', data);
			} else {
				if (Session.get('permissions')) commit('getPermissions', Session.get('permissions'));
			}
		},
	},
};

export default userInfosModule;
