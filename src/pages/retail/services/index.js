import request from '@/utils/request';
import CONST from '@/services/CONST'
// import errorHandler from '@/services/errorHandler';

const { URL } = CONST;
const jw = "http://192.168.0.114:8000/api"

// 提现申请记录列表
export async function doGetDistributionWithDraw(data) {
  return request(`${URL}/distribution/distributionWithdraw/page`,{
        method: 'GET',
        data,
    });
}

// 提现申请记录导出
export async function doExportDistributionWithDraw(data) {
  return request(`${URL}/distribution/distributionWithdraw/export`,{
        method: 'GET',
        data,
    });
}

// 提现申请记录审核
export async function doAuditDistributionWithDraw(data) {
  return request(`${URL}/distribution/distributionWithdraw/audit`,{
        method: 'GET',
        data,
    });
}

// 提现规则查询
export async function doGetWithdrawRule(data) {
  return request(`${URL}/distribution/distributionWithdraw/getWithdrawRule`,{
        method: 'GET',
        data,
    });
}

// 提现规则设置
export async function doSetWithdrawRule(data) {
  return request(`${URL}/distribution/distributionWithdraw/setWithdrawRule`,{
        method: 'GET',
        data,
    });
}


// 团长列表
export async function doQueryLeaderPage(data) {
  return request(`${URL}/distribution/leader/queryLeaderPage`,{
        method: 'GET',
        data,
    });
}


// 团长列表(状态变更)
export async function doUpdateLeaderCardStatus(data) {
  return request(`${URL}/distribution/leader/updateLeaderCardStatus`,{
        method: 'POST',
        data,
    });
}

// 团长列表(分佣比例)
export async function doUpdateLeaderRate(data) {
  return request(`${URL}/distribution/leader/updateLeaderRate`,{
        method: 'POST',
        data,
    });
}

// 添加团长
export async function doAddTeamLeader(data) {
  return request(`${URL}/distribution/leader/addTeamLeader`,{
        method: 'POST',
        data,
    });
}

// 团长申请列表
export async function doQueryApplyLeaderPage(data) {
  return request(`${URL}/distribution/leader/queryApplyLeaderPage`,{
        method: 'GET',
        data,
    });
}

// 团长申请列表（状态变更）
export async function doUpdateLeaderStatus(data) {
  return request(`${URL}/distribution/leader/updateLeaderStatus`,{
        method: 'POST',
        data,
    });
}



