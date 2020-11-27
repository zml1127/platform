import request from '@/utils/request';
import CONST from '@/services/CONST';
// import errorHandler from '@/services/errorHandler';

const { URL } = CONST;

// 查询油品列表
export async function doGetOilPageList(data) {
	// console.log("获取油品参数data:",data)
	// const json = await request(`${BASE_URL}/service/oilList`, {
    const json = await request(`${URL}/merchant/merchantOil/getOilPageList`, {
    // const json = await request(`http://192.168.0.146:20002/merchantOil/getGasServiceList`, {
		method: 'POST',
        data,
	});
    // return errorHandler(json);
    return json
}

// 油品删除
export async function doDeleteOil(data) {
	console.log("删除油品参数data:",data)
	// const json = await request(`${BASE_URL}/service/oilList`, {
    const json = await request(`${URL}/merchant/merchantOil/deleteOil`, {
		method: 'GET',
        // data,
        params: data,
	});
    // return errorHandler(json);
    return json
}

// 下架油品
export async function doOilOffline(data) {
	console.log("下架油品参数data:",data)
	// const json = await request(`${BASE_URL}/service/oilList`, {
    const json = await request(`${URL}/merchant/merchantOil/oilOffline`, {
		method: 'GET',
        // data,
        params: data
	});
    // return errorHandler(json);
    return json
}

// 上架油品
export async function doOilOnline(data) {
	console.log("下架油品参数data:",data)
	// const json = await request(`${BASE_URL}/service/oilList`, {
    const json = await request(`${URL}/merchant/merchantOil/oilOnline`, {
		method: 'GET',
        // data,
        params: data
	});
    // return errorHandler(json);
    return json
}

// 获取店铺油品服务列表
export async function doGetMerchantOilPage(data) {
	console.log("获取店铺油品服务列表参数data:",data)
	// const json = await request(`${BASE_URL}/service/oilList`, {
    const json = await request(`${URL}/merchant/merchantOil/merchantOilPage`, {
		method: 'POST',
        data,
	});
    // return errorHandler(json);
    return json
}

// 油品店铺获取历史列表  
export async function doGetHistoryList(data) {
	console.log("获取历史列表参数data:",data)
	const json = await request(`${URL}/merchant/merchantOil/merchantOilHisPageList`, {
    // const json = await request(`${BASE_URL}/service/get_merchantlist`, {
		method: 'POST',
        data,
        // params: data
	});
	// console.log("json:",json)
    // return errorHandler(json);
    return json
}

// 获取排序列表 
export async function doGetMerchantOilSorting(data) {
	console.log("获取排序列表参数data:",data)
	const json = await request(`${URL}/merchant/merchantOil/getMerchantOilByMerchantId`, {
    // const json = await request(`${BASE_URL}/service/get_merchantlist`, {
		method: 'GET',
        // data,
        params: data
	});
	// console.log("json啊啊啊啊啊啊啊啊啊啊啊啊啊:",json)
    // return errorHandler(json);
    return json
}

// 排序 
export async function doSorting(data) {
	console.log("排序参数data:",data)
	const json = await request(`${URL}/merchant/merchantOil/sorting?ids=${data.ids}`, {
    // const json = await request(`${BASE_URL}/service/get_merchantlist`, {
		method: 'GET',
        // data
        // params: data
	});
	// console.log("json=:",json)
    // return errorHandler(json);
    return json
}

// 编辑页获取回显信息 
export async function doGetById(data) {
	// console.log("编辑页获取辉县信息参数data:",data)
	const json = await request(`${URL}/merchant/merchantOil/getById`, {
    // const json = await request(`${BASE_URL}/service/get_merchantlist`, {
		method: 'GET',
        // data,
        params: data
	});
	// console.log("json=:",json)
    // return errorHandler(json);
    return json
}

// 获取油枪号
export async function doGetOilGun(data) {
	// console.log("获取油枪号参数data:",data)
	const json = await request(`${URL}/merchant/merchantOil/merchantOilGun`, {
    // const json = await request(`${BASE_URL}/service/get_merchantlist`, {
		method: 'GET',
        // data,
        params: data
	});
    // return errorHandler(json);
    return json
}

// 提交表单 
export async function doUpdateMerchantOil(data) {
	console.log("提交表单参数data:",data)
	const json = await request(`${URL}/merchant/merchantOil/updateMerchantOil`, {
    // const json = await request(`${BASE_URL}/service/get_merchantlist`, {
		method: 'POST',
        data,
        // params: data
	});
	// console.log("json=:",json)
    // return errorHandler(json);
    return json
}


