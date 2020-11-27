import {
	doGetLogsList
} from '../services/index';

const Model = {
	namespace: 'log',
	state: {},
	effects: {
		// 获取日志列表
		*getLogsList({ payload }, { call }) {
			const response = yield call(doGetLogsList, payload);
			if (response) {
				// console.log('日志列表返回值:', response);
				return {
					data: response.data,
					page: response.pages,
					total: response.total,
				};
			}
		},
	},
	reducers: {},
};
export default Model;
