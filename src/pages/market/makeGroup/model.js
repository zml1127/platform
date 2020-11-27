/* eslint-disable no-param-reassign */
import {
	doGetPageList, //获取拼团列表
	doGetServiceCategoryList, //洗美类型二级查询
	doCreateOrUpdate, //拼团活动模板创建或修改
	doGetGroupTplInfo, //编辑普通拼团回显 
	doUpdateStatus, //失效删除
	doGetGroupDetailList, //获取拼团详情列表
	doUpdate, //拼团详情编辑提交
	doGetById, //拼团详情编辑回显
} from './service';

const Model = {
	namespace: 'makeGroup',
	state: {
        serviceCategoryList: [],
	},
	effects: {
		// 获取拼团列表
		*getPageList({ payload }, { call, put }) {
			const response = yield call(doGetPageList, payload);

			if (response && response.code == '0000') {
				return {
					data: response.data,
					total: response.total,
				}
			}
		},
		// 洗美类型二级查询 
		*getServiceCategoryList({ payload }, { call, put }) {
			const response = yield call(doGetServiceCategoryList, payload);

			if (response && response.code == '0000') {
				yield put({
					type: 'save',
					payload: ['serviceCategoryList', response.data]
				})
				return response.data
			}
		},
		// 拼团活动模板创建或修改 
		*createOrUpdate({ payload }, { call, put }) {
			const response = yield call(doCreateOrUpdate, payload);

			if (response && response.code == '0000') {
				return response
			}
		},
		// 编辑普通拼团回显 
		*getGroupTplInfo({ payload }, { call, put }) {
			const response = yield call(doGetGroupTplInfo, payload);

			if (response && response.code == '0000') {
				return response.data
			}
		},
		// 失效删除 
		*updateStatus({ payload }, { call, put }) {
			const response = yield call(doUpdateStatus, payload);

			if (response && response.code == '0000') {
				return response
			}
		},
		// 获取拼团详情列表
		*getGroupDetailList({ payload }, { call, put }) {
			const response = yield call(doGetGroupDetailList, payload);

			if (response && response.code == '0000') {
				return {
					data: response.data,
					total: response.total,
				}
			}
		},
		// 拼团详情编辑提交 
		*update({ payload }, { call, put }) {
			const response = yield call(doUpdate, payload);

			if (response && response.code == '0000') {
				return response
			}
		},
		// 拼团详情编辑回显 
		*getById({ payload }, { call, put }) {
			const response = yield call(doGetById, payload);

			if (response && response.code == '0000') {
				return response.data
			}
		},
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, action) {
			const [key, value] = action.payload;
			state[key] = value;
			return state
		},
	},
	subscriptions: {},
};
export default Model;
