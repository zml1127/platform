/* eslint-disable no-restricted-syntax */
import request from '@/utils/request';
import CONST from '@/services/CONST';

const { URL } = CONST;
// const URL="https://api.shangkehy.com"
// const BASE_URL="http://192.168.0.160:8000/api/plat";
//    const BASE_URL="fq";
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
export async function doGetContractsigningList(data) {
	return request(`${URL}/platformweb/signMerchant/selectList?${f(data)}`, {
		method: 'GET',
	});

	
}

// 导出${URL}/api/sign
export async function doGetExportList(data) {
	return request(`${URL}/platformweb/signMerchant/getUploadExcelUrl?${f(data)}`, {
		method: 'GET',
	});

}

// 线下进行数据导出
export async function doGetDataexport(data) {
	return request(`${URL}/platformweb/sign/export/getOfflineExcelUrl?${f(data)}`, {
		method: 'GET',
	});

	
}
