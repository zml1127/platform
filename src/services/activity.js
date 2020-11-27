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

// 获取 活动入口列表   123
export async function doPostlistForPEJ(data) {
	return request(`${URL}/market/actentrance/listForPEJ`,{

		method:"POST",
		data
	}
	);
}
// 获取 活动入口排序   123
export async function doGetpageSorting(data) {
	return request(`${URL}/market/actentrance/listForPEJ`,{

		method:"POST",
		data
	}
	);
}

// 获取 首页新人礼   4
export async function doGetpageForPop(data) {
    return request(`${URL}/market/actentrance/pageForIndexPopup?${f(data)}`);
}
// 获取 商户端胶囊位   5
export async function doGetpageForMerchant(data) {
    return request(`${URL}/market/actentrance/pageForMerchantCapsule?${f(data)}`);
}
// 获取 支付完成页   6
export async function doGetpageForPay(dat) {
	const data={...dat,current:1,pageSize:99999}
    return request(`${URL}/market/actentrance/pageForPayFinish?${f(data)}`);
}
// 获取 福利中心页   7
export async function doGetpageForCnter(data) {
    return request(`${URL}/market/actentrance/listForWelfareCentre?${f(data)}`);
}
// 获取 福利中心页详情   7id
export async function doGetCenterDetail(data) {
    return request(`${URL}/market/actentrance/getByIdForWelfareCentre?${f(data)}`);
}
// 获取 支付完成页详情   6id
export async function doGetPayDetail(data) {
    return request(`${URL}/market/actentrance/getByIdForPayFinish?${f(data)}`);
}
// 获取 首页中心页详情   4id
export async function doGetIndexDetail(data) {
    return request(`${URL}/market/actentrance/getByIdForIndexPopup?${f(data)}`);
}
// 获取 商户胶囊页详情   5id
export async function doGetMerchantDetail(data) {
    return request(`${URL}/market/actentrance/getByIdForMerchantCapsule?${f(data)}`);
}
// 获取 删除 活动
export async function doPostDel(id) {
    return request(`${URL}/market/actentrance/delete`,{
		method:"GET",
		data:{
			id
		}
	});
}
// 获取 删除 活动设置
export async function doPostDelSet(id) {
    return request(`${URL}/market/actactivity/delete`,{
		method:"GET",
		data:{
			id
		}
	});
}
// 获取 失效 活动设置
export async function doPostInvalid(id) {
    return request(`${URL}/market/actactivity/invalid`,{
		method:"GET",
		data:{
			id
		}
	});
}
// 获取 更新状态
export async function doGetUStatus(id) {
    return request(`${URL}/market/actentrance/updateStatus?actEntranceId=${id}`);
}

// 获取 活动入口设置 拍序  000
export async function doGetpageSort(data) {
    return request(`${URL}/market/actentrance/actEntranceSorting?${f(data)}`);
}

export async function doGetActivityList(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`/api/activityList`);
}
// 创建活动
export async function doPostActivityCreate(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`${URL}/market/actentrance/create`,{
		method:"POST",
		data
	});
}
// 更新活动
export async function doPostActivityUpdate(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`${URL}/market/actentrance/update`,{
		method:"POST",
		data
	});
}
// type123
export async function doGetDetail(data,type){
	switch (type) {
		case 1:
		case 2:
		case 3:	
		return request(`${URL}/market/actentrance/getByIdForPEJ`,{
				method:"GET",
				data
		});
		
		case 4:	
		return request(`${URL}/market/actentrance/getByIdForIndexPopup?${f(data)}`);
		case 5:
		return request(`${URL}/market/actentrance/getByIdForMerchantCapsule?${f(data)}`);
		case 6:
		return request(`${URL}/market/actentrance/getByIdForPayFinish?${f(data)}`);
		case 7:
		return request(`${URL}/market/actentrance/getByIdForWelfareCentre?${f(data)}`);
		default:
			break;
	}
	 
}


// 获取活动详情
export async function doGetActivityDetail(data) {
	// const json = await request(`${BASE_URL}/business/getMerchantList?${f(data)}`, {
	// });

    // return errorHandler(json);
    return request(`${URL}/market/actentrance/getByIdForPEJ`,{
		method:"GET",
		data
	});
}


// 获取优惠券 活动分页列表分页
export async function doGetCouponActivityList(data) {

    return request(`${URL}/market/merchantCoupon/getCouponActivityList`,{
		method:"GET",
		data:{...data,queryType:1}
	});
}

// 获取 活动编辑或新增
export async function doPostActivityEdit(data) {

    return request(`${URL}/market/actactivity/edit`,{
		method:"POST",
		data
	});
}
// 获取 活动设置列表
export async function doPostActivityPage(data) {

    return request(`${URL}/market/actactivity/page`,{
		method:"POST",
		data
	});
}
// 获取 活动设置某ID详情
export async function doGetByIdDetail(id) {

    return request(`${URL}/market/actactivity/getById`,{
		method:"GET",
		data:{
			id
		}
	});
}
