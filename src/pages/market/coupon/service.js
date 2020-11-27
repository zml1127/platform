import request from '@/utils/request';
import CONST from '@/services/CONST';
// import errorHandler from '@/services/errorHandler';

const { URL } = CONST;

// 失效删除 
export async function doUpdateStatus(data) {
    const json = await request(`${URL}/market/marketCouponTpl/updateStatus`, {
		method: 'GET',
        params: data,
	});
    return json
}

// 获取优惠券列表
export async function doGetCouponActivityList(data) {
	console.log('获取优惠券列表参数data==', data)
    const json = await request(`${URL}/market/merchantCoupon/getCouponActivityList`, {
		method: 'GET',
        // data,
        params: data,
    });
  
    // return errorHandler(json);
    return json
}



// 点击参加店铺数获取店铺列表
export async function doGetShopList(data) {
	console.log('点击参加店铺数获取店铺列表参数data==', data)
	const json = await request(`${URL}/platformweb/market/couponMerchant`, {
		method: 'GET',
        params: data,
	});
    return json
}

// 获取关联服务列表 getAssoiatList
export async function doGetAssoiatList(data) {
    const json = await request(`${URL}/merchant/merchantService/serviceCategoryLinkage`, { 
		method: 'GET',
        params: data
	});
    return json
}

// 平台优惠券模板创建或修改 
export async function doCreateOrUpdate(data) {
    const json = await request(`${URL}/market/merchantCoupon/createOrUpdate`, { 
		method: 'POST',
        data,
	});
    // return errorHandler(json);
    return json
}
// 平台优惠券编辑回显 
export async function doGetPlatCouponInfo(data) {
    const json = await request(`${URL}/market/merchantCoupon/getCouponInfo`, { 
		method: 'POST',
        params: data,
	});
    return json
}
// 获取服务类型列表  
export async function doGetServiceCategoryList(data) {
	console.log('店铺优惠券模板创建或修改参数data==', data)
    const json = await request(`${URL}/merchant/merchantService/serviceAndOil`, { 
		method: 'GET',
	});
    return json
}

// 店铺优惠券模板创建或修改 
export async function doCreateOrUpdateShop(data) {
	console.log('店铺优惠券模板创建或修改参数data==', data)
    const json = await request(`${URL}/market/marketCouponTpl/createOrUpdate`, { 
		method: 'POST',
        data,
	});
    return json
}
// 店铺优惠券编辑回显 
export async function doGetShopCouponInfo(data) {
	// console.log('优惠券编辑回显参数data==', data)
    const json = await request(`${URL}/market/marketCouponTpl/getCouponTplInfo`, { 
		method: 'POST',
        params: data,
	});
    return json
}


// 获取兑换物品列表
export async function doGetExChangeList(data) {
	console.log('获取兑换物品列表参数data==', data)
    const json = await request(`${URL}/market/actgoods/list`, {
		method: 'GET',
        params: data
	});
    return json
}

// 获取店铺详情列表
export async function doGetShopDetailList(data) {
	const json = await request(`${URL}/platformweb/market/getCouponGroup`, {
		method: 'POST',
        data,
	});
    return json
}

// 优惠券详情页编辑 
export async function doUpdateMerchantCouponExtend(data) {
    const json = await request(`${URL}/market/merchantCoupon/updateMerchantCouponExtend`, {
		method: 'POST',
        data,
	});
    return json
}
// 优惠券详情页编辑回显 
export async function doGetMerchantExtendById(data) {
    const json = await request(`${URL}/market/merchantCoupon/getMerchantExtendById`, {
		method: 'GET',
        params: data
	});
    return json
}

// 获取商品券列表
export async function doGetGoodsList(data) {
	console.log('获取商品券列表参数data==', data)
	const json = await request(`${URL}/distribution/extendcoupon/page`, {
		method: 'GET',
        data,
	});
    return json
}

// 创建商品券
export async function doCreate(data) {
	console.log('创建商品券参数data==', data)
    const json = await request(`${URL}/distribution/extendcoupon/create`, {
		method: 'POST',
        data
	});
    return json
}

// 商品券编辑提交表单
export async function doUpdateGoods(data) {
    const json = await request(`${URL}/distribution/extendcoupon/update`, {
		method: 'POST',
        data
	});
    return json
}

// 商品券失效
export async function doUpdateGoodsStatus(data) {
    const json = await request(`${URL}/distribution/extendcoupon/updateStatus`, {
		method: 'GET',
        data
	});
    return json
}

// 删除商品券
export async function doDeleteGoods(data) {
    const json = await request(`${URL}/distribution/extendcoupon/delete`, {
		method: 'GET',
        data
	});
    return json
}

// 商品券查看编辑回显
export async function doGetGoodsInfo(data) {
    const json = await request(`${URL}/distribution/extendcoupon/getById`, {
		method: 'GET',
        params: data,
    });
    // const json = await request(`http://localhost:80/doGetGoodsInfo`, {
    //     method: 'GET',
    //     data,
    // });
    return json
}
