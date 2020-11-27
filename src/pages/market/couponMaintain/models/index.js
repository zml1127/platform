/* eslint-disable no-param-reassign */
import {
	doGetExtendcouponTypeList,
	doGetExtendcouponTypePage,
	doCreateExtendcouponType,
	doDeleteExtendcouponType,
	doUpdateExtendcouponType
} from '../services';

const Model = {
	namespace: 'couponMaintain',
	state: {
		orderList: [],
		couponTypeList:[]
	},
	effects: {
		 // 获取异业券类型列表
		 *getExtendcouponTypePage({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponTypePage, payload);
			return response
		},
        // 获取异业券类型列表
        *getExtendcouponTypeList({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponTypeList, payload);
			yield put({
				type:'save',
				payload: ['couponTypeList', response.data]
			})
			return response
		},
		 // 获取异业券类型创建
		 *createExtendcouponType({ payload }, { call, put }) {
			 console.log(payload)
			const response = yield call(doCreateExtendcouponType, payload);
			return response
		},
		// 获取异业券类型删除
		*deleteExtendcouponType({ payload }, { call, put }) {
			const response = yield call(doDeleteExtendcouponType, payload);
			return response
		},
		// 获取异业券类型更新
		*updataExtendcouponType({ payload }, { call, put }) {
			const response = yield call(doUpdateExtendcouponType, payload);
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
