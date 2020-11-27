import request from '@/utils/request';
import CONST from '@/services/CONST';

const { URL } = CONST;

// 获取 平台数据
export async function doGetPlatformData() {
	return request(`${URL}/platformweb/kanban/getKanBanAllData`, {
		method: 'POST',
	});
}

// 获取 平台图标数据
export async function doGetPlatformChart(data) {
	return request(`${URL}/platformweb/kanban/getKanBanLine`, {
		method: 'POST',
		data,
	});
}

// 获取 店铺数据
export async function doGetMerchantData(data) {
	return request(`${URL}/platformweb/kanban/getKanBanMerchnatData`, {
		method: 'POST',
		data,
	});
}

// 获取 店铺图标数据
export async function doGetMerchantChart(data) {
	return request(`${URL}/platformweb/kanban/getMerchantKanBanLine`, {
		method: 'POST',
		data,
	});
}