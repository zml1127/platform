/* eslint-disable no-restricted-syntax */
import request from '@/utils/request';
// import errorHandler from '@/services/errorHandler';
import CONST from '@/services/CONST';

  const { URL } = CONST;
//   const URL = "http://192.168.0.155:8000/api"
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
export async function doGetMerchantList(data) {
	return request(`${URL}/merchant/merchant/search?${f(data)}`);
}
// 商品券里获取商户列表
export async function doGetMerchantGoodsList(data) {
	// return request(`${URL}/merchant/merchantService/merchantServicePage`,{
	// return request(`${URL}/merchant/merchant/getPageListByServiceCategoryId`,{
	return request(`${URL}/merchant/merchantService/merchantServicePage`,{
		method:"POST",
		data,
	});
}

// export async function doGetMerchantGoodsList(data) {
// 	console.log('接口里参数data==', data)
// 	// const json = await request(`${BASE_URL}/business/arealist`, {
// 	const json = await request(`${URL}/merchant/merchantService/merchantServicePage`, {
// 		method: 'POST',
// 		data,
// 	});
// 	return json;
// }
// 获取单个店铺详情列表
export async function doGetMerchantById(id) {
    return request(`${URL}/merchant/merchant/getById?id=${id}`);
}
// 根据id批量获取商户信息
export async function doPostMerchantByIds(ids) {;
    return request(`${URL}/merchant/merchant/getByIds`,{
		method:"POST",
		data:{
			ids
		}
	});
}
// 设置为种子/普通用户
export async function doGetUpdateIsSeed(data) {
    return request(`${URL}/merchant/merchant/updateIsSeed`,{
		method:"GET",
		data,
	});
}
// 获取服务标签查询
export async function doGetMerchantserviceTag() {

    return request(`${URL}/merchant/merchant/serviceTag/list`);
}
// 获取油品服务信息
export async function doGetOilMerchantId(data) {
	console.log(data,"data");
    return request(`${URL}/merchant/merchantOil/getMerchantOilByMerchantId`,{
		method:"GET",
		data
	});
}
// 获取油品服务信息 拼团 ----2211----
export async function doGetSpellGroup(data) {
	console.log(data,"data");
    return request(`${URL}/platformweb/market/getMerchantSpellGroup`,{
		method:"POST",
		data
	});
}
// 获取优惠券服务信息  ----2211---- 
export async function doGetCouponGroup(data) {
	console.log(data,"data");
    return request(`${URL}/platformweb/market/getCouponGroup`,{
		method:"POST",
		data
	});
}

// 获取服务标签查询
export async function doGetService() {
	// api/merchant/merchantService/serviceCategoryList
    return request(`${URL}/merchant/merchantService/serviceCategoryList`);
}
// 获取服务信息查询
export async function doGetMerchantSInfo(data) {
	// api/merchant/merchantService/serviceCategoryList
    return request(`${URL}/merchant/merchantService/merchantServiceByMerchantIdByType`,{
		method:"GET",
		data
	});
}
// 获取特色标签查询 doGetMerchantspecialTag
export async function doGetMerchantspecialTag() {

    return request(`${URL}/merchant/merchant/specialTag/list`);
}
// 单个店铺编辑 doGetMerchantspecialTag
export async function doPostMerchantUpdate(data) {
    return request(`${URL}/merchant/merchant/update`,{
		method:"POST",
		data
	});
}
// 单个店铺新增 doGetMerchantspecialTag
export async function doPostMerchantCreate(data) {
    return request(`${URL}/merchant/merchant/create`,{
		method:"POST",
		data
	});
}

// 服务类目查询 X
export async function doGetserviceCategorylevel2List(data){
	return request(`${URL}/platformweb/merchant/serviceCategory/level2List?${f(data)}`);
}


// 店铺类型查询 
export async function doGetmerchanttypelist(data){
	return request(`${URL}/platformweb/merchant/type/list?${f(data)}`);
}

// 获取连锁商户列表
export async function doGetMerchantListBro(data) {
    return request(`/api/bromerchantList`);
}
// 获取单个商户
export async function doGetMerchantId(data) {
    return request(`/api/merchantByid`);
}

// 店铺类型映射
export async function doGetMerchantType() {
    return request(`${URL}/merchant/merchant/getMerchantType`,{
        method:"GET",
    });
}
