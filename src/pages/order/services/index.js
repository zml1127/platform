import request from '@/utils/request';
import CONST from '@/services/CONST';

const { URL } = CONST;
// 加油
export async function doGetOilList(data) {
  return request(`${URL}/platformweb/order/getOilServiceOrderPage`, {
    method: 'POST',
    data,
  });
}

// 兑换
export async function doGetGoodsList(data) {
  return request(`${URL}/platformweb/order/getGoodsServiceOrderPage`, {
    method: 'POST',
    data,
  });
}

// 保险
export async function doGetInsureList(data) {
  return request(`${URL}/platformweb/order/getInsuranceOrderPage`, {
    method: 'POST',
    data,
  });
}

// 服务
export async function doGetServiceList(data) {
  return request(`${URL}/platformweb/order/getWashServiceOrderPage`, {
    method: 'POST',
    data,
  });
}

// 服务类型
export async function doGetServiceCategoryList(data) {
  return request(`${URL}/merchant/merchantService/serviceCategoryList`, {
    method: 'GET',
  });
}

// 分销订单
export async function doGetLocalLifePagelistForPlatForm(data) {
  return request(`${URL}/distribution/extendcouponorder/getLocalLifePagelistForPlatForm`, {
    method: 'POST',
    data
  });
}
// 套餐信息
export async function doGetComboDetailByOrderId(data) {
  return request(`${URL}/order/order/getComboDetailByOrderId`, {
    method: 'GET',
    data
  });
}
