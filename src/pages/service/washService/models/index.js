/* eslint-disable no-param-reassign */
import {
	doGetMerchantServiceByIdNew,
	doGetSingleByMerchantId,
	doGetPriceByNumAndPrice,
	doGetSingleByMerchantIdForSearch,
} from '../services';

const Model = {
	namespace: 'washServer',
	state: {
		orderList: [],
		serverList:[],
	},
	effects: {
		//服务详情
		*getMerchantServiceByIdNew({ payload } , { call, put }) {
			const response = yield call(doGetMerchantServiceByIdNew, payload);
			return response
		},
        // 获取服务列表
        *getSingleByMerchantIdForSearch({ payload }, { call, put }) {

			const response = yield call(doGetSingleByMerchantIdForSearch, payload);
			yield put({
				type: "save",
				payload:["serverList",response.data]
			})
			return response
		},
		//计算价格
		*getPriceByNumAndPrice({ payload } , { call, put }) {

			const response = yield call(doGetPriceByNumAndPrice, payload);
			return response
		},
		
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, { payload }) {
			const [key, value] = payload;
			state[key] = value;
			return state;
		},
	},
	subscriptions: {},
};
export default Model;
