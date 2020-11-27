import request from '@/utils/request';
import CONST from "@/services/CONST"
// import errorHandler from '@/services/errorHandler';
const {URL} = CONST
const Guo = ""
// const URL = "http://192.168.0.155:8000/api"

// 获取异业券类型列表
export async function doGetExtendcouponTypePage(data) {
    const json = await request(`${URL}/distribution/extendcoupontype/page`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取异业券类型列表分页
export async function doGetExtendcouponTypeList(data) {
    const json = await request(`${URL}/distribution/extendcoupontype/getList`, {
        method: 'GET',
        data,
    });

    return json;
}

// 异业券类型添加
export async function doCreateExtendcouponType(data) {
    const json = await request(`${URL}/distribution/extendcoupontype/create`, {
        method: 'POST',
        data,
    });

    return json;
}

// 异业券类型更新
export async function doUpdateExtendcouponType(data) {
    const json = await request(`${URL}/distribution/extendcoupontype/update`, {
        method: 'POST',
        data,
    });

    return json;
}

// 异业券类型删除
export async function doDeleteExtendcouponType(data) {
    const json = await request(`${URL}/distribution/extendcoupontype/delete`, {
        method: 'GET',
        data,
    });

    return json;
}