/* eslint-disable no-param-reassign */
import {
	doGetentranceListPlat,
	doGetentranceListStore
} from '@/services/moa';

const Model = {
	state: {
		total: 0,
		enableTotal: 0,
		onlineTotal: 0,
	},
	effects: {
		// // 获取商户列表
        *getEntranceListPlat({ payload }, { call }) {
			
			
			const response = yield call(doGetentranceListPlat, payload);
			if (response) {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return response;
		},
        *getEntranceListStore({ payload }, { call }) {
			
			
			const response = yield call(doGetentranceListStore, payload);
			if (response) {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return response;
		},
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
