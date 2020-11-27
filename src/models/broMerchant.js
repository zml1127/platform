/* eslint-disable no-param-reassign */
import {
	doGetBroMerchantList,
	doGetMerchantById,
	doGetMerchantserviceTag,
	doGetMerchantspecialTag,// 特色标签
	doPostMerchantUpdate,// 店铺编辑 更细 
	doPostMerchantCreate,// 店铺 新增
} from '@/services/broMerchant';

const Model = {
	state: {
		total: 0,
		enableTotal: 0,
		onlineTotal: 0,
	},
	effects: {
		// // 获取商户列表
        *getMerchantList({ payload }, { call }) {
			const response = yield call(doGetBroMerchantList, payload);
			if (response) {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return response;
		},// 获取店铺详情
        *getMerchantId({ id }, { call }) {
			const response = yield call(doGetMerchantById, id);
			if(response.code==="0000"){
				return response.data
			}
			return false;
		},// 获取店铺服务标签 合并 店铺特色标签
		*getMerchantserviceTag(_, { call }) {
			const response = yield call(doGetMerchantserviceTag);
			const response2= yield call(doGetMerchantspecialTag);
			if(response.code==="0000"&&response2.code==="0000"){
				return {service:response.data,special:response2.data}
			}

			return false;
		},// 店铺编辑 接口
		*postMerchantUpdate({data}, { call }) {
			
			const response= yield call(doPostMerchantUpdate,data);
			if(response.code==="0000"){
				return response.data;
			}

			return false;
		},// 店铺新增 接口
		*postMerchantCreate({data}, { call }) {
			
			const response= yield call(doPostMerchantCreate,data);
			if(response.code==="0000"){
				return response.data;
			}

			return false;
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
