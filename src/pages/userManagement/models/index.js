/* eslint-disable no-param-reassign */
import {
	doGetUsertocmpList,
	doGetOrderList,
	doGetTrainList,
	doGetCount
} from '../services';

const Model = {
	namespace: 'userManagement',
	state: {
		orderList: [],
	},
	effects: {
        // 获取用户列表
        *getUsertocmpList({ payload }, { call, put }) {
			const response = yield call(doGetUsertocmpList, payload);
			return response
		},
		// 获取用户列表
        *getCount({ payload }, { call, put }) {
			const response = yield call(doGetCount, payload);
			return response
		},
		
		// 获取订单列表
        *getOrderList({ payload }, { call, put }) {
			const response = yield call(doGetOrderList, payload);
			return response
		},
		// 获取车辆列表
        *getTrainList({ payload }, { call, put }) {
			const response = yield call(doGetTrainList, payload);
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
