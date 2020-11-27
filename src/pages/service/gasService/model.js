/* eslint-disable no-param-reassign */
import {
	doGetOilPageList, //获取优品列表
	doDeleteOil, //油品删除
	doOilOffline, //下架油品
	doOilOnline, //上架油品
	doCreateOil, //添加油品号
	doGetMerchantOilPage, //获取店铺油品服务列表
	doGetHistoryList, //获取历史列表
	doGetMerchantOilSorting, //获取排序列表
	doSorting, //排序
	doGetById, //编辑页获取回显信息
	doGetOilGun, //查询商户未被占用的油枪号
	doUpdateMerchantOil, //提交表单
} from './service';
import { message } from 'antd';

const Model = {
	namespace: 'gasService',
	state: {
		
	},	
	effects: {
		// **获取油品列表
		*getOilPageList({ payload }, { call, put }) {
			const response = yield call(doGetOilPageList, payload);
			// console.log('***获取加油列表response==', response)
			if (response && response.code == '0000') {
				return  {
					data: response.data,
					total: response.total, //总数
					// size:response.data.size, //一页多少条
					// current:response.data.current, //当前页数
					// pages:response.data.pages, //有多少页
				};
			}
		},
		// **油品删除
		*deleteOil({ payload }, { call, put }) {
			const response = yield call(doDeleteOil, payload);
			console.log('**删除油皮response==', response)
			if (response && response.code == '0000') {
				message.success('删除成功')
				return response
			}else{
				message.error(response.msg)
			}
		},
		// **油品下架 
		*oilOffline({ payload }, { call, put }) {
			const response = yield call(doOilOffline, payload);
			console.log('**下架油品response==', response)
			if (response && response.code == '0000') {
				message.success('下架成功')
				return response
			}
		},
		// **油品上架 
		*oilOnline({ payload }, { call, put }) {
			const response = yield call(doOilOnline, payload);
			// console.log('**上架油品response==', response)
			if (response && response.code == '0000') {
				message.success('上架成功')
				return response
			}
		},
		// **获取店铺油品服务
		*getMerchantOilPage({ payload }, { call, put }) {
			const response = yield call(doGetMerchantOilPage, payload);
			// console.log('**获取店铺油品服务列表response==', response)
			if (response && response.code == '0000') {
				return  {
					data: response.data,
					total: response.total, //总数
				};
			}
		},
		//  商户油品务历史查询分页
		*getHistoryList({ payload }, { call, put }) {
			const response = yield call(doGetHistoryList, payload);
			
			if (response && response.code == '0000') {
				// console.log('***历史列表response==', response)
				return  {
					data: response.data,
					total: response.total, //总数
				};
			}
		},
		// 获取排序列表 
		*getMerchantOilSorting({ payload }, { call, put }) {
			const response = yield call(doGetMerchantOilSorting, payload);
			
			console.log('***排序列表response==', response)
			if (response && response.code == '0000') {
				return response.data
			}
		},
		// 排序 
		*sorting({ payload }, { call, put }) {
			const response = yield call(doSorting, payload);
			
			console.log('***排序后结果response==', response)
			if (response && response.code == '0000') {
				return response
			}
		},
		// 获取回显信息 
		*getById({ payload }, { call, put }) {
			const response = yield call(doGetById, payload);
			
			// console.log('***获取回显信息结果response==', response)
			if (response && response.code == '0000') {
				return response.data
			}
		},
		// 获取油枪列表
		*getOilGun({ payload }, { call, put }) {
			const response = yield call(doGetOilGun, payload);
			// console.log('***response==', response)
			if (response && response.code == '0000') {
				return response.data
			}
		},
		// 提交表单 
		*updateMerchantOil({ payload }, { call, put }) {
			const response = yield call(doUpdateMerchantOil, payload);
			
			console.log('***提交表单结果response==', response)
			if (response && response.code == '0000') {
				return response
			}
		},
    
	},
	reducers: {
		save(state, action) {
			const [key, value] = action.payload;
			state[key] = value;
			return state
		},
	},
	subscriptions: {},
};
export default Model;
