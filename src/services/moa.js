/* eslint-disable no-restricted-syntax */
import request from '@/utils/request';
// import errorHandler from '@/services/errorHandler';
// import CONST from '@/services/CONST';

//  const { BASE_URL } = CONST;
// const BASE_URL="http://192.168.0.160:8000/api/plat";
// const BASE_URL="ysx";
 // "http://192.168.0.160:8000/api/plat"  "ysx";
export function f(obj) {
	// 定义一个空数组
	const ary = [];
	let str;
	// 对象的遍历操作

	// eslint-disable-next-line guard-for-in
	for (const i in obj) {
		// 将对象名push到数组里
		ary.push(i);
		// 对象的值
		ary.push(`=${obj[i]}&`);
	}
	// 将数组转变成字符串
	str = ary.join('');
	// 将字符串最后一个&符剪切走
	str = str.slice(0, str.length - 1);
	return str;
}
//doGetentranceList,
	//doGetsetList
// 获取列表活动
export async function doGetentranceListPlat(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`/api/entranceListPlat`);
}
// 获取列表活动
export async function doGetentranceListStore(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`/api/entranceListStore`);
}
// 获取单个商户
export async function doGetMerchantId(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`/api/merchantByid`);
}

