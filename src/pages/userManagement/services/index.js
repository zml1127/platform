import request from '@/utils/request';
import CONST from "@/services/CONST"
// import errorHandler from '@/services/errorHandler';
const {URL} = CONST
const LP = "http://192.168.0.150/api"
// 获取用户信息列表
export async function doGetUsertocmpList(data) {
    const json = await request(`${URL}/user/usertocmp/list`, {
        method: 'GET',
        data,
    });

    return json;
}
// 获取用户详情统计
export async function doGetCount(data) {
    const json = await request(`${URL}/platformweb/userInfo/getCount`, {
        method: 'GET',
        data,
    });

    return json;
}
// 获取订单列表
export async function doGetOrderList(data) {
    const json = await request(`${URL}/platformweb/userInfo/getListOrder`, {
        method: 'GET',
        data,
    });

    return json;
}
// 获取车辆列表
export async function doGetTrainList(data) {
    const json = await request(`${URL}/platformweb/userInfo/getListVehicle`, {
        method: 'GET',
        data,
    });

    return json;
}


