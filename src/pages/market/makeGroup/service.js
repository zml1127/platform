import request from '@/utils/request';
import CONST from '@/services/CONST';
// import errorHandler from '@/services/errorHandler';

const { URL } = CONST;

// 获取拼团列表
export async function doGetPageList(data) {
	console.log('获取拼团列表参数data==', data)
	// const json = await request(`${BASE_URL}/service/getShopList`, {
    const json = await request(`${URL}/market/marketGroupTpl/pageList`, {
		method: 'GET',
        // data,
        params: data
	});
    // return errorHandler(json);
    return json
}

// 洗美类型二级查询 
export async function doGetServiceCategoryList(data) {
	// const json = await request(`${BASE_URL}/service/getShopList`, {
    const json = await request(`${URL}/merchant/merchantService/serviceCategoryList`, {
		method: 'GET',
	});
    // return errorHandler(json);
    return json
}

// 拼团活动模板创建或修改
export async function doCreateOrUpdate(data) {
    console.log('提交表单参数data==', data)
	// const json = await request(`${BASE_URL}/service/getShopList`, {
    const json = await request(`${URL}/market/marketGroupTpl/createOrUpdate`, {
        method: 'POST',
        data,
	});
    // return errorHandler(json);
    return json
}

// 编辑普通拼团回显 
export async function doGetGroupTplInfo(data) {
	console.log('获取店铺拼团回显参数data==', data)
	// const json = await request(`${BASE_URL}/service/getShopList`, {
    const json = await request(`${URL}/market/marketGroupTpl/getGroupTplInfo`, {
    // const json = await request(`http://localhost:8001/marketGroupTpl/getGroupTplInfo`, {
		method: 'POST',
        // data,
        params: data
	});
    // return errorHandler(json);
    return json
}
// 失效删除 
export async function doUpdateStatus(data) {
	console.log('失效删除参数data==', data)
	// const json = await request(`${BASE_URL}/service/getShopList`, {
    const json = await request(`${URL}/market/marketGroupTpl/updateStatus`, {
    // const json = await request(`http://localhost:8001/marketGroupTpl/getGroupTplInfo`, {
		method: 'GET',
        // data,
        params: data
	});
    // return errorHandler(json);
    return json
}
// 获取拼团详情列表
export async function doGetGroupDetailList(data) {
	console.log('获取拼团详情列表参数data==', data)
    const json = await request(`${URL}/platformweb/market/getMerchantSpellGroup`, {
    // const json = await request(`http://localhost:8001/getGroupDetailList`, {
    // const json = await request(`http://192.168.0.146:8000/api/platformweb/market/getMerchantSpellGroup`, {
		method: 'POST',
        data,
	});
    // return errorHandler(json);
    return json
}

// 拼团详情编辑提交 
export async function doUpdate(data) {
	console.log('拼团详情编辑提交参数data==', data)
    const json = await request(`${URL}/market/marketMerchantGroup/update`, {
    // const json = await request(`http://localhost:8001/market/marketMerchantGroup/update`, {
		method: 'POST',
        data,
	});
    // return errorHandler(json);
    return json
}
// 拼团详情编辑回显 
export async function doGetById(data) {
	console.log('拼团详情编辑提交参数data==', data)
    const json = await request(`${URL}/market/marketMerchantGroup/getById`, {
    // const json = await request(`http://localhost:8001/getById`, {
		method: 'GET',
        data,
	});
    // return errorHandler(json);
    return json
}


