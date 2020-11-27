/* eslint-disable no-param-reassign */
import {
    doGetContractsigningList,
    doGetExportList,
    doGetDataexport
} from '@/services/contractsigning';

const Model = {
	state: {
		total: 0,
		enableTotal: 0,
		onlineTotal: 0,
	},
	effects: {
		// 合同签约数据
		*getContractsigningList({ payload }, { call }) {
			const response = yield call(doGetContractsigningList, payload);
			if (response) {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return response;
        },
        // 导出
		*getExportList({ payload }, { call }) {
			const response = yield call(doGetExportList, payload);
			if (response) {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return response;
        },
        // 线下进行数据导出
		*getDataexport({ payload }, { call }) {
			const response = yield call(doGetDataexport, payload);
			if (response) {
				return {
					data: response.list,
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
