import request from '@/utils/request';
import CONST from "@/services/CONST"
// import errorHandler from '@/services/errorHandler';
const {URL} = CONST
// const URL = "http://192.168.0.155:8000/api"
const Guo = ""

// 获取本地生活列表
export async function doGetLocalLifePageListForShow(data) {
    const json = await request(`${URL}/distribution/extendcoupon/getLocalLifePageListForShow`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取本地生活列表(状态变更)
export async function doUpdateLocalLifeStatus(data) {
    const json = await request(`${URL}/distribution/extendcoupon/updateLocalLifeStatus`, {
        method: 'GET',
        data,
    });
    return json;
}
// 获取本地生活列表(删除)
export async function doDelLocalLife(data) {
    const json = await request(`${URL}/distribution/extendcoupon/delLocalLife`, {
        method: 'POST',
        data,
    });
    return json;
}
// 获取添加本地生活列表
export async function doGetLocalLifePageListFowAdd(data) {
    const json = await request(`${URL}/distribution/extendcoupon/getLocalLifePageListFowAdd`, {
        method: 'GET',
        data,
    });

    return json;
}
// 获取本地生活列表(添加)
export async function doGetaddLocalLife(data) {
    const json = await request(`${URL}/distribution/extendcoupon/addLocalLife`, {
        method: 'POST',
        data,
    });

    return json;
}

// 推送消息
export async function doSendMessage(data) {
    const json = await request(`${URL}/user/couponPush/sendExtendCoupon`, {
        method: 'POST',
        data,
    });

    return json;
}
// 推送记录
export async function doSelectPushRecordList(data) {
    const json = await request(`${URL}/user/couponPush/selectPushRecordList`, {
        method: 'POST',
        data,
    });
    return json;
}
// 推送记录详情
export async function doSelectPushDetails(data) {
    const json = await request(`${URL}/user/couponPush/selectPushDetails`, {
        method: 'POST',
        data,
    });
    return json;
}


