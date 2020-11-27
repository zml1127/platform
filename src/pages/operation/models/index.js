/* eslint-disable no-param-reassign */
import {
	doGetOpmaterialPage,
	doGetOpmaterialId,
	doCreateOpmaterial,
	doUpdateOpmaterial,
	doDeleteOpmaterial,
	doGetAppletsList,
	doGetFeedBackList,
	doGetFeedBackDetail,
	doGetFeedBackUserStatus
} from '../services';

const Model = {
	namespace: 'operation',
	state: {
		orderList: [],
	},
	effects: {
        // 获取素材列表
        *getOpmaterialPage({ payload }, { call, put }) {
			const response = yield call(doGetOpmaterialPage, payload);
			return response
		},
		// 获取素材列表详情
        *getOpmaterialId({ payload }, { call, put }) {
			const response = yield call(doGetOpmaterialId, payload);
			return response
		},
		// 创建素材
        *createOpmaterial({ payload }, { call, put }) {
			const response = yield call(doCreateOpmaterial, payload);
			return response
		},
		// 更新素材
		*updateOpmaterial({ payload }, { call, put }) {
			const response = yield call(doUpdateOpmaterial, payload);
			return response
		},
		// 删除素材
        *deleteOpmaterial({ payload }, { call, put }) {
			const response = yield call(doDeleteOpmaterial, payload);
			return response
		},	
		// 获取小程序消息列表
		*getAppletsList({ payload }, { call, put }) {
			const response = yield call(doGetAppletsList, payload);
			return response
		},
		// 反馈信息列表
		*getFeedBackList({ payload }, { call, put }) {
			const response = yield call(doGetFeedBackList, payload);
			return response
		},
		// 反馈信息列表详情
		*getFeedBackDetail({ payload }, { call, put }) {
			const response = yield call(doGetFeedBackDetail, payload);
			return response
		},
		// 反馈信息列表详情状态修改
		*getFeedBackUserStatus({ payload }, { call, put }) {
			const response = yield call(doGetFeedBackUserStatus, payload);
			return response
		},
		*setMaterial({payload}, { call, put }) {
			console.log("payload",payload)
			yield put({
				type: 'save',
				payload: ['selectMaterial', payload],
			});
		}
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
