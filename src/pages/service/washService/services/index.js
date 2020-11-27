import request from '@/utils/request';
import CONST from '@/services/CONST'
// import errorHandler from '@/services/errorHandler';

const { URL } = CONST;
const jw = "http://192.168.0.114:8000/api"

//获取洗美服务详情
export async function doGetMerchantServiceByIdNew(data) {
  console.log(data)
  return request(`${URL}/merchant/merchantService/getMerchantServiceByIdNew`,{
    method:"GET",
    data,
  });
}

// 获取下单项服务
export async function doGetSingleByMerchantIdForSearch(data) {
  return request(`${URL}/merchant/merchantService/getSingleByMerchantIdForSearch`,{
    method:"GET",
    data,
  });
}

//计算价格
export async function doGetPriceByNumAndPrice(data) {
  return request(`${URL}/merchant/merchantService/getPriceByNumAndPrice`,{
    method:"POST",
    data,
  });
}


