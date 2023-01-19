import request from '/@/utils/request';

/**
 * 登录api接口集合
 * @method signIn 用户登录
 */
export function login(params: object){
	return request({
		url: '/api/v1/system/login',
		method: 'post',
		data: params,
	});
}

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
 * 退出登录
 */
export function logout(){
	return request({
		url: '/api/v1/system/logout',
		method: 'get',
	});
}
