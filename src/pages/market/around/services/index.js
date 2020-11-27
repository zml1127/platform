import request from '@/utils/request';
import CONST from "@/services/CONST"
// import errorHandler from '@/services/errorHandler';
const {URL} = CONST
// const URL = "http://192.168.0.155:8000/api"
const Guo = ""

// 获取周边券列表
export async function doGetExtendcouponList(data) {
    const json = await request(`${URL}/distribution/extendcoupon/page`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取店铺下周边券列表
export async function doGetExtendcouponListM(data) {
    const json = await request(`${URL}/distribution/extendcoupon/pageForMerchantShow`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取店铺下周边券添加列表
export async function doGetExtendcouponListAdd(data) {
    const json = await request(`${URL}/distribution/extendcoupon/pageForMerchantAdd`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取店铺下周边券店铺列表
export async function doGetListForExtendCouponMerchant(data) {
    const json = await request(`${URL}/distribution/extendcouponmerchant/getListForExtendCouponMerchant`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取店铺下周边券解绑
export async function doGetDeleteByExtendCouponId(data) {
    const json = await request(`${URL}/distribution/extendcouponmerchant/deleteById`, {
        method: 'GET',
        data,
    });

    return json;
}

// 获取店铺下周边券添加
export async function doCreateExtendsCouponIdAndMerchantIds(data) {
    const json = await request(`${URL}/distribution/extendcouponmerchant/createExtendCouponIdsAndMerchantId`, {
        method: 'POST',
        data,
    });

    return json;
}
// 获取店铺下商品券修改库存
export async function doUpdateMerchantStock(data) {
    const json = await request(`${URL}/distribution/extendcouponmerchant/updateMerchantStock`, {
        method: 'POST',
        data,
    });

    return json;
}

// 店铺下周边券状态
export async function doGetExtendcouponmerchantUpdateStatus(data) {
    const json = await request(`${URL}/distribution/extendcouponmerchant/updateStatus`, {
        method: 'GET',
        data,
    });

    return json;
}
// 周边券删除
export async function doGetExtendcouponDelete(data) {
    const json = await request(`${URL}/distribution/extendcoupon/delete`, {
        method: 'GET',
        data,
    });

    return json;
}

// 周边券状态
export async function doGetExtendcouponUpdateStatus(data) {
    const json = await request(`${URL}/distribution/extendcoupon/updateStatus`, {
        method: 'GET',
        data,
    });

    return json;
}


// 周边券创建
export async function doGetExtendcouponCreate(data) {
    const json = await request(`${URL}/distribution/extendcoupon/create`, {
        method: 'POST',
        data,
    });

    return json;
}

// 周边券获取
export async function doGetExtendcouponGetById(data) {
    const json = await request(`${URL}/distribution/extendcoupon/getById`, {
        method: 'GET',
        data,
    });

    return json;
}
// 周边券获取(连连)
export async function doGetProductList(data) {
    const json = await request(`${URL}/distribution/product/getProductList`, {
        method: 'GET',
        data,
    });

    return json;
}
// 详情获取(连连)
export async function doGetProductDetail(data) {
    const json = await request(`${URL}/distribution/product/getProductDetail`, {
        method: 'GET',
        data,
    });

    return json;
}

// 周边券更新
export async function doGetExtendcouponUpdate(data) {
    const json = await request(`${URL}/distribution/extendcoupon/update
    `, {
        method: 'POST',
        data,
    });

    return json;
}
// 服务券订单
export async function doGetExtendcouponorderList(data) {
    const json = await request(`${URL}/distribution/extendcouponorder/getPagelistForPlatForm`, {
        method: 'GET',
        data,
    });

    return json;
}
// 服务券订单(退款)
export async function doGetExtendcouponorderRefund(data) {
    const json = await request(`${URL}/distribution/extendcouponorder/refundOrder`, {
        method: 'GET',
        data,
    });

    return json;
}

// 服务券订单(取消订单)
export async function doGetExtendcouponorderCancelOrder(data) {
    const json = await request(`${URL}/distribution/extendcouponorder/cancelOrder`, {
        method: 'GET',
        data,
    });

    return json;
}
// 服务券订单(核销码添加)
export async function doGetExtendcouponorderAddCheckCode(data) {
    const json = await request(`${URL}/distribution/extendcouponorder/addCheckCode`, {
        method: 'POST',
        data,
    });

    return json;
}

