import request from '@/utils/request';
import CONST from '@/services/CONST';

const { URL } = CONST;

// 获取加油订单列表
export async function doGetAgentList(data) {
	return request(`${URL}/insurance1/insBank/getAgentList`, {
		method: 'POST',
		params: data,
	});
}

// 编辑银行卡
export async function doEditBankCard(data) {
    return request(`${URL}/insurance1/insBank/editBankCard`, {
        method: 'POST',
        params: data,
    });
}

// 获取白名单列表
export async function doGetWhiteList() {
	return request(`${URL}/insurance1/insBank/getMerchantWhitelist`, {
		method: 'POST',
	});
}

// 获取银行列表
export async function doGetBankList() {
    return request(`${URL}/insurance1/insBank/getBankList`, {
        method: 'POST',
    }); 
}

// 省市列表
export async function doGetCityList() {
    return request(`${URL}/insurance1/insBank/getSysArea`, {
        method: 'POST',
    }); 
}

// 获取银行卡信息
export async function doGetCardList(data) {
    return request(`${URL}/insurance1/insBank/getBankCardList`, {
        method: 'POST',
        params: data
    });   
}
