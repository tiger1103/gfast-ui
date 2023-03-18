import request from '/@/utils/request';

/**
 * 获取验证码
 */
export function captcha(){
	return request({
		url:"/api/v1/pub/captcha/get",
		method:"get"
	})
}

/**
 * （不建议写成 request.post(xxx)，因为这样 post 时，无法 params 与 data 同时传参）
 *
 * 登录api接口集合
 * @method signIn 用户登录
 * @method signOut 用户退出登录
 */
export function useLoginApi() {
	return {
		signIn: (params: object) => {
			return request({
				url: '/api/v1/system/login',
				method: 'post',
				data: params,
			});
		},
		signOut: (params: object) => {
			return request({
				url: '/api/v1/user/signOut',
				method: 'post',
				data: params,
			});
		},
	};
}
