/* eslint-disable no-param-reassign */
import {
	doUpdateStatus, //失效删除
	doGetCouponActivityList, // 获取优惠券列表
	doGetShopList, //点击参加店铺数获取店铺列表
	doGetAssoiatList, //获取关联服务列表
	doGetExChangeList, //获取兑换物品列表
	doCreateOrUpdate, //平台优惠券模板创建或修改
	doGetPlatCouponInfo, //平台优惠券编辑回显

	doGetShopDetailList, //获取店铺详情列表
	doGetServiceCategoryList, //获取服务类型列表
	doCreateOrUpdateShop, //店铺优惠券模板创建或修改
	doGetShopCouponInfo, //店铺编辑回显
	doUpdateMerchantCouponExtend, //优惠券详情页编辑
	doGetMerchantExtendById, //优惠券详情页编辑回显
	doGetGoodsInfo, //商品券查看编辑回显
	doGetGoodsList, //获取商品券列表
	doCreate, //商品券创建
	doUpdateGoodsStatus, //商品券失效
	doDeleteGoods, //删除商品券
	doUpdateGoods, //商品券编辑提交表单
} from './service';

const Model = {
	namespace: 'coupon',
	state: {
        
	},
	effects: {
		// 失效删除 
		*updateStatus({ payload }, { call, put }) {
			const response = yield call(doUpdateStatus, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response
			}
		},
		// 获取优惠券列表
		*getCouponActivityList({ payload }, { call, put }) {
			const response = yield call(doGetCouponActivityList, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return {
					data: response.data,
					total: response.total,
				}
			}
		},
		// 点击参加店铺数获取店铺列表
		*getShopList({ payload }, { call, put }) {
			const response = yield call(doGetShopList, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return {
					data: response.data,
					total: response.total,
				}
			}
		},
		// 获取关联服务列表
		*getAssoiatList({ payload }, { call, put }) {
			const response = yield call(doGetAssoiatList, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 平台优惠券模板创建或修改  
		*createOrUpdate({ payload }, { call, put }) {
			const response = yield call(doCreateOrUpdate, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response
			}
		},
		// 平台优惠券编辑回显 
		*getPlatCouponInfo({ payload }, { call, put }) {
			const response = yield call(doGetPlatCouponInfo, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},

		// 服务类型列表 
		*getServiceCategoryList({ payload }, { call, put }) {
			const response = yield call(doGetServiceCategoryList, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 店铺优惠券模板创建或修改  
		*createOrUpdateShop({ payload }, { call, put }) {
			const response = yield call(doCreateOrUpdateShop, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response
			}
		},
		// 店铺编辑回显 
		*getShopCouponInfo({ payload }, { call, put }) {
			const response = yield call(doGetShopCouponInfo, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 获取兑换物品列表
		*getExChangeList({ payload }, { call, put }) {
			const response = yield call(doGetExChangeList, payload);
			console.log('responseresponseresponse', response)
			if(response && response.code == '0000'){
				return {
					data: response.data 
				}
			}
		},
		// 获取店铺详情列表
		*getShopDetailList({ payload }, { call, put }) {
			const response = yield call(doGetShopDetailList, payload);
			if(response && response.code == '0000'){
				return {
					data: response.data,
					total: response.total, 
				}
			}
		},
		// 优惠券详情页编辑 
		*updateMerchantCouponExtend({ payload }, { call, put }) {
			const response = yield call(doUpdateMerchantCouponExtend, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response
			}
		},
		// 优惠券详情页编辑回显 
		*getMerchantExtendById({ payload }, { call, put }) {
			const response = yield call(doGetMerchantExtendById, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 商品券编辑查看回显 
		*getGoodsInfo({ payload }, { call, put }) {
			const response = yield call(doGetGoodsInfo, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 获取商品券列表
		*getGoodsList({ payload }, { call, put }) {
			const response = yield call(doGetGoodsList, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return {
					data: response.data,
					total: response.total,
				}
			}
		},
		// 创建商品券
		*create({ payload }, { call, put }) {
			const response = yield call(doCreate, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 商品券编辑提交表单
		*updateGoods({ payload }, { call, put }) {
			const response = yield call(doUpdateGoods, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response.data
			}
		},
		// 商品券失效
		*updateGoodsStatus({ payload }, { call, put }) {
			const response = yield call(doUpdateGoodsStatus, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response
			}
		},
		// 删除商品券
		*deleteGoods({ payload }, { call, put }) {
			const response = yield call(doDeleteGoods, payload);
			// console.log('接口得到的response==', response)
			if(response && response.code == '0000'){
				return response
			}
		},
    
	},
	reducers: {
		save(state, action) {
			const [key, value] = action.payload;
			state[key] = value;
		},
	},
	subscriptions: {},
};
export default Model;
