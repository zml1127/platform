/* eslint-disable no-param-reassign */
import {
	doGetDistributionWithDraw,
	doExportDistributionWithDraw,
	doAuditDistributionWithDraw,
	doQueryLeaderPage,
	doUpdateLeaderCardStatus,
	doUpdateLeaderRate,
	doAddTeamLeader,
	doQueryApplyLeaderPage,
	doUpdateLeaderStatus,
	doGetWithdrawRule,
	doSetWithdrawRule
} from '../services';

const Model = {
	namespace: 'retail',
	state: {
		orderList: [],
	},
	effects: {
        // 获取申请列表
        *getDistributionWithDrawPage({ payload }, { call, put }) {
			const response = yield call(doGetDistributionWithDraw, payload);
			return response
		},
		// 获取申请列表导出
        *exportDistributionWithDraw({ payload }, { call, put }) {
			const response = yield call(doExportDistributionWithDraw, payload);
			return response
		},
		// 获取申请列表审核
        *auditDistributionWithDraw({ payload }, { call, put }) {
			const response = yield call(doAuditDistributionWithDraw, payload);
			return response
		},
		// 提现规则获取
        *getWithdrawRule({ payload }, { call, put }) {
			const response = yield call(doGetWithdrawRule, payload);
			return response
		},
		// 提现规则设置
        *setWithdrawRule({ payload }, { call, put }) {
			const response = yield call(doSetWithdrawRule, payload);
			return response
		},
		
		// 团长列表
        *queryLeaderPage({ payload }, { call, put }) {
			const response = yield call(doQueryLeaderPage, payload);
			return response
		},
		// 团长列表（状态变更）
        *updateLeaderCardStatus({ payload }, { call, put }) {
			const response = yield call(doUpdateLeaderCardStatus, payload);
			return response
		},
		// 团长列表（分佣比例）
        *updateLeaderRate({ payload }, { call, put }) {
			const response = yield call(doUpdateLeaderRate, payload);
			return response
		},
		// 添加团长
        *addTeamLeader({ payload }, { call, put }) {
			const response = yield call(doAddTeamLeader, payload);
			return response
		},
		// 团长申请列表
        *queryApplyLeaderPage({ payload }, { call, put }) {
			const response = yield call(doQueryApplyLeaderPage, payload);
			return response
		},
		// 团长申请列表(状态变更)
        *updateLeaderStatus({ payload }, { call, put }) {
			const response = yield call(doUpdateLeaderStatus, payload);
			return response
		},
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, { payload }) {
			const [key, value] = payload;
			state[key] = value;
			return state
		},
	},
	subscriptions: {},
};
export default Model;
