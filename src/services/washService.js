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

// 获取洗美妆服务管理列表
export async function doGetserviceList() {
    return request(`${URL}/merchant/merchantService/serviceList`,{
		method:"GET",
	});
}
// 获取 店铺洗美服务列表
export async function doPostServicePage(data) {
    return request(`${URL}/merchant/merchantService/merchantServicePage`,{
		method:"POST",
		data
	});
}
// 获取 店铺洗美服务历史查询
export async function doGetHisMerchant(data) {
    return request(`${URL}/merchant/merchantService/merchantServiceHisByMerchantId`,{
		method:"POST",
		data
	});
}
// 获取 店铺洗美服务 详情
export async function doGetMSBIdDetail(id) {
    return request(`${URL}/merchant/merchantService/getMerchantServiceById`,{
		method:"GET",
		data:{
			id
		}
	});
}

// 获取 店铺洗美服务 编辑
export async function doPostMerchantUp(data) {
    return request(`${URL}/merchant/merchantService/updateMerchantService`,{
		method:"POST",
		data
	});
}
// 获取 店铺洗美服务 排序详情页
export async function doGetMerchantId(data) {
    return request(`${URL}/merchant/merchantService/getByMerchantId`,{
		method:"GET",
		data
	});
}
// 获取获取下单项服务
export async function doGetSingleByMerchantId(merchantId) {
    return request(`${URL}/platformweb/merchantService/getSingleByMerchantId`,{
		method:"GET",
		data:{
			merchantId
		}
	});
}
// 获取 店铺洗美服务 排序请求
export async function doGetSorting(ids) {
    return request(`${URL}/merchant/merchantService/serviceSorting?ids=${ids}`);
}
// 获取 店铺洗美服务 排序请求
export async function doGetTag(data) {
    return request(`${URL}/merchant/merchantService/getTag`,{
		method:"GET",
		data
	});
}



// 获取 洗美妆服务管理上线
export async function postUp(id) {
	console.log(id,"idxxqqaa");
    
    return request(`${URL}/merchant/merchantService/serviceCategoryOnline`,{
		method:"GET",
		data:{
			id
		}
	});
}
// 获取 洗美妆服务管理下线
export async function postDown(id) {

    console.log(id,"idxxqqaa");
    return request(`${URL}/merchant/merchantService/serviceCategoryOffline`,{
		method:"GET",
		data:{
			id
		}
	});
}


