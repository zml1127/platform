/* eslint-disable no-param-reassign */
import {
	// doPostMerchantService,
	doPostServicePage,
	doGetHisMerchant
} from '@/services/washService';

const Model = {
	state: {
		total: 0,
		enableTotal: 0,
		onlineTotal: 0,
	},
	effects: {
		// // // 获取商户列表
        // *postMerchantService({ payload }, { call }) {
			
			
		// 	const response = yield call(doPostMerchantService, payload);
		// 	console.log(payload,"payload");
		// 	if (response) {
		// 		return {
		// 			data: response.data,
		// 			page: response.current,
		// 			total: response.total,
		// 		};
		// 	}
		// 	return response;
		// },
        *postServicePage({ payload }, { call }) {
			const response = yield call(doPostServicePage, payload);
			console.log(payload,"payload");
			if (response.code==='0000') {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return false;
		}, // 店铺历史查询
        *getHisMerchant({ payload }, { call }) {
			const response = yield call(doGetHisMerchant, payload);
			console.log(payload,"payload",response);
			
			if (response.code==='0000') {
				return {
					data: response.data,
					page: payload.current,
					total: response.total,
				};
			}
			return false;
		}
       
	},
	reducers: {
		save(state, action) {
			state.total = action.payload.total;
			state.onlineTotal = action.payload.onlineTotal;
			state.enableTotal = action.payload.enableTotal;
		},
	},
};
export default Model;
