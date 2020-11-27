/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';


const messageHandle = json =>{
	json.then(
		(res)=>{
		if(!res)return
		const { code, msg } = res;
		if ( !code && msg ) {
			notification.error({
				message: msg,
			});
			// return false;
		}

		if ( code && code !== '0000') {
			// TODO 这里重新配置需要在右上角提示的错误信息
			if(code !== '1002' && code !== '1011' && code !== 'M1004'){
				notification.error({
					message: msg,
				});
			}
		
			// if (code === '1001' && !/#\/user\/login/.test(window.location.hash)) {
			// 	history.push({
			// 		pathname: '/user/login',
			// 		query: {
			// 			redirect: window.location.href,
			// 		},
			// 	});
			// }

			if (['1002', 'M1004'].includes(code) && !/#\/user\/login/.test(window.location.hash)) {
				history.push({
					pathname: '/user/login',
					query: {
						redirect: window.location.href,
					},
				});
			}
			
			// return false;
		}
	},
	req=>{})
	return json;
}

const codeMessage = {
	200: '服务器成功返回请求的数据。',
	201: '新建或修改数据成功。',
	202: '一个请求已经进入后台排队（异步任务）。',
	204: '删除数据成功。',
	400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
	401: '用户没有权限（令牌、用户名、密码错误）。',
	403: '用户得到授权，但是访问是被禁止的。',
	404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
	406: '请求的格式不可得。',
	410: '请求的资源被永久删除，且不会再得到的。',
	422: '当创建一个对象时，发生一个验证错误。',
	500: '服务器发生错误，请检查服务器。',
	502: '网关错误。',
	503: '服务不可用，服务器暂时过载或维护。',
	504: '网关超时。',
};
/**
 * 异常处理程序
 */

const errorHandler = ({ response }) => {
	if (response && response.status) {
		const errorText = codeMessage[response.status] || response.statusText;
		const { status, url } = response;
		notification.error({
			message: `请求错误 ${status}: ${url}`,
			description: errorText,
		});
	} else if (!response) {
		notification.error({
			description: '您的网络发生异常，无法连接服务器',
			message: '网络异常',
		});
	}

	return response;
};
/**
 * 配置request请求时的默认参数
 */

const requestHandle = extend({
	errorHandler, // 默认错误处理
	// headers: {
	//  'Content-Type': 'application/json',
	//  'Accept': '*/*',
	//  'Access-Control-Allow-Origin':'*',
	//    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,PUT,DELETE'
	//   },
	//   mode:'no-cors'
});

const requestBlobHandle = extend({
	errorHandler, // 默认错误处理
	responseType: 'blob',
});

const getHeaders = isLogin => {
	let headers =  {
		token: localStorage.getItem('platform_token') || '',
		// token:"5a33e25690a745da9da8e67da8f2997e",
		client_type: 10,
		'Content-Type':'application/json',
	}
	if(isLogin){
		delete headers.token
	}
	return headers
	// timestamp: Date.now(),
	// sign: md5(data),
	// nonce: Math.random(),
};

//循环trim
const trimAll = data => {
	let _data = Object.assign({}, data)
	if ( data instanceof Array ) {
		_data = data.concat([])
	}
	let keys = Object.keys(_data)
	keys.forEach((key)=>{
		if (typeof _data[key] === 'string') {
			_data[key] = _data[key].trim()
		} else if ( _data[key] instanceof Object ) {
			_data[key] = trimAll(_data[key])
		}
	})
	return _data
}

const request = (_url, cfg = {}, responseType) => {
	// console.log(" url:",url,"cfg:",cfg,"responseType:",responseType)
	
	cfg.data = cfg.data ? trimAll(cfg.data) : {};
	
	const url = _url;
	let isLogin = cfg.isLogin || false
	delete cfg.isLogin

	if ( cfg.method === 'GET' && Object.keys(cfg.data).length !== 0 ) {
		cfg.params = cfg.data;
		cfg.data = {};
	}

	// cfg.data.params = cfg.data.params || {};

	let json

	if (responseType === 'blob') {
		// noinspection JSCheckFunctionSignatures
		json = requestBlobHandle(url, {
			...cfg,
			headers: getHeaders(cfg.data),
		});
	}

	// noinspection JSCheckFunctionSignatures
	json = requestHandle(url, {
		...cfg,
		headers: getHeaders(isLogin),
	});
	return messageHandle(json)
};

export default request;
