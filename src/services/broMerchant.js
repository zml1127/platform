/* eslint-disable no-restricted-syntax */
import request from '@/utils/request';
// import errorHandler from '@/services/errorHandler';
import CONST from '@/services/CONST';

  const { URL } = CONST;
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

// 获取商户列表
export async function doGetBroMerchantList(data) {
    return request(`${URL}/merchant/chain/search?${f(data)}`);
}
// 获取单个连锁店铺详情列表
export async function doGetMerchantById(id) {


    return request(`${URL}/merchant/chain/getById?id=${id}`);
}
// 获取 关联 商户 列表 
export async function doGetsubList(id) {

    return request(`${URL}/merchant/chain/subList?id=${id}`);
}
// 获取服务标签查询
export async function doGetMerchantserviceTag() {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);

    return request(`${URL}/merchant/merchant/serviceTag/list`);
}
// 获取特色标签查询 doGetMerchantspecialTag
export async function doGetMerchantspecialTag() {
    
    return request(`${URL}/merchant/merchant/specialTag/list`);
}
// 单个店铺编辑 
export async function doPostMerchantUpdate(data) {
	console.log(data,"xxqqzz");
    return request(`${URL}/merchant/chain/update`,{
		method:"POST",
		data
	});
}
// 连锁店铺新增 
export async function doPostMerchantCreate(data) {

    return request(`${URL}/merchant/chain/create`,{
		method:"POST",
		data
	});
}




// // 服务类目查询 X
// export async function doGetserviceCategorylevel2List(data){
// 	return request(`${URL}/platformweb/merchant/serviceCategory/level2List?${f(data)}`);
// }


// // 店铺类型查询 
// export async function doGetmerchanttypelist(data){
// 	return request(`${URL}/platformweb/merchant/type/list?${f(data)}`);
// }

// // 获取连锁商户列表
// export async function doGetMerchantListBro(data) {
// 	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
// 	// });

//     // return errorHandler(json);
//     return request(`/api/bromerchantList`);
// }
// // 获取单个商户
// export async function doGetMerchantId(data) {
// 	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
// 	// });

//     // return errorHandler(json);
//     return request(`/api/merchantByid`);
// }

