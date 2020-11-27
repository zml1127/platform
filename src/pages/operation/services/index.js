import request from '@/utils/request';
import CONST from '@/services/CONST'
// import errorHandler from '@/services/errorHandler';

const { URL } = CONST;
const jw = "http://192.168.0.114:8000/api"
// 获取素材列表
export async function doGetOpmaterialPage(data) {
  return request(`${URL}/market/opmaterial/page`,{
        method: 'GET',
        data,
    });
}
// 获取素材列表详情
export async function doGetOpmaterialId(data) {
  return request(`${URL}/market/opmaterial/getById`,{
        method: 'GET',
        data,
    });
}
// 创建素材
export async function doCreateOpmaterial(data) {
  return request(`${URL}/market/opmaterial/create`,{
        method: 'POST',
        data,
    });
}
// 更新素材
export async function doUpdateOpmaterial(data) {
  return request(`${URL}/market/opmaterial/update`,{
        method: 'POST',
        data,
    });
}
// 删除素材
export async function doDeleteOpmaterial(data) {
  return request(`${URL}/market/opmaterial/delete`,{
        method: 'GET',
        params:data,
    });
}

// 获取小程序推送消息列表
export async function doGetAppletsList(data) {
  return request(`/api/operation/appletsList`,{
        method: 'GET',
        data,
  });
}

// 反馈消息列表
export async function doGetFeedBackList(data) {
  return request(`${URL}/platformweb/userfeedback/page`,{
        method: 'GET',
        data,
  });
}

// 反馈消息列表详情
export async function doGetFeedBackDetail(data) {
  return request(`${URL}/platformweb/userfeedback/getById`,{
        method: 'GET',
        params:data,
  });
}

// // 修改反馈状态
export async function doGetFeedBackUserStatus(data) {
  return request(`${URL}/user/userfeedback/feedBackUserStatus`,{
        method: 'GET',
        params:data,
  });
}

