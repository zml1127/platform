/* eslint-disable no-param-reassign */
import {
	doGetLocalLifePageListForShow,
	doGetLocalLifePageListFowAdd,
	doUpdateLocalLifeStatus,
	doGetaddLocalLife,
	doDelLocalLife,
	doSendMessage,
	doSelectPushRecordList,
	doSelectPushDetails
} from '../services';

const Model = {
	namespace: 'localLife',
	state: {
		orderList: [],
	},
	effects: {
        // 获取本地生活列表
        *getLocalLifePageListForShow({ payload }, { call, put }) {
			const response = yield call(doGetLocalLifePageListForShow, payload);
			return response
		},

		// 获取添加本地生活列表(状态变更)
        *updateLocalLifeStatus({ payload }, { call, put }) {
			const response = yield call(doUpdateLocalLifeStatus, payload);
			return response
		},
		// 获取添加本地生活列表(删除)
        *delLocalLife({ payload }, { call, put }) {
			const response = yield call(doDelLocalLife, payload);
			return response
		},
		
		// 获取添加本地生活列表
		*getLocalLifePageListFowAdd({ payload }, { call, put }) {
			const response = yield call(doGetLocalLifePageListFowAdd, payload);
			return response
		},
		// 获取添加本地生活列表(添加)
        *getaddLocalLife({ payload }, { call, put }) {
			const response = yield call(doGetaddLocalLife, payload);
			return response
		},
		// 推送消息
        *sendMessage({ payload }, { call, put }) {
			const response = yield call(doSendMessage, payload);
			return response
		},
		// 推送消息
        *selectPushRecordList({ payload }, { call, put }) {
			const response = yield call(doSelectPushRecordList, payload);
			return response
		},
		// 推送消息详情
        *selectPushDetails({ payload }, { call, put }) {
			const response = yield call(doSelectPushDetails, payload);
			return response
		},
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, { payload }) {
			return { ...state, ...payload };
		},
	},
	subscriptions: {},
};
export default Model;
