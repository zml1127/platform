import request from '@/utils/request';
import CONST from '@/services/CONST'

const { URL } = CONST;

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
// 获取省市区列表
export async function doGetCityList() {
	// const json = await request(`${BASE_URL}/business/arealist`, {
	const json = await request(`${URL}/user/area/getAreaList`, {
		method: 'GET',
		// data,
	});

	return json;
}
// 获取用于oss的token
export async function doGetStsToken(data) {
   return request(`${URL}/user/oss/getStsToken`, {
		method: 'GET',
	});

}
