/* eslint-disable no-param-reassign */
import {
	doGetExtendcouponList,
	doGetExtendcouponListM,
	doGetExtendcouponDelete,
	doGetExtendcouponUpdateStatus,
	doGetExtendcouponCreate,
	doGetExtendcouponGetById,
	doGetExtendcouponUpdate,
	doGetExtendcouponListAdd,
	doCreateExtendsCouponIdAndMerchantIds,
	doGetExtendcouponmerchantUpdateStatus,
	doGetDeleteByExtendCouponId,
	doGetExtendcouponorderList,
	doGetExtendcouponorderRefund,
	doGetExtendcouponorderAddCheckCode,
	doGetProductList,
	doGetProductDetail,
	doGetListForExtendCouponMerchant,
	doUpdateMerchantStock,
	doGetExtendcouponorderCancelOrder

} from '../services';

const Model = {
	namespace: 'around',
	state: {
		orderList: [],
	},
	effects: {
        // 获取周边券列表
        *getExtendcouponList({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponList, payload);
			return response
		},
		// 获取店铺周边券列表
        *getExtendcouponListM({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponListM, payload);
			return response
		},
		// 获取店铺商品券列表
        *getListForExtendCouponMerchant({ payload }, { call, put }) {
			const response = yield call(doGetListForExtendCouponMerchant, payload);
			return response
		},
		// 店铺商品券库存修改
        *updateMerchantStock({ payload }, { call, put }) {
			const response = yield call(doUpdateMerchantStock, payload);
			return response
		},
		// 获取店铺周边券解绑
        *getDeleteByExtendCouponId({ payload }, { call, put }) {
			const response = yield call(doGetDeleteByExtendCouponId, payload);
			return response
		},
		// 获取店铺周边券添加列表
        *getExtendcouponListAdd({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponListAdd, payload);
			return response
		},
		// 店铺下周边券列表添加
        *createExtendsCouponIdAndMerchantIds({ payload }, { call, put }) {
			const response = yield call(doCreateExtendsCouponIdAndMerchantIds, payload);
			return response
		},
		// 店铺下周边券状态
        *getExtendcouponmerchantUpdateStatus({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponmerchantUpdateStatus, payload);
			return response
		},
		// 周边券删除
        *getExtendcouponDelete({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponDelete, payload);
			return response
		},
		// 周边券状态
        *getExtendcouponUpdateStatus({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponUpdateStatus, payload);
			return response
		},
		// 周边券添加
        *getExtendcouponCreate({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponCreate, payload);
			return response
		},
		// 周边券获取
        *getExtendcouponGetById({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponGetById, payload);
			return response
		},
		// 周边券获取(连连)
        *getProductList({ payload }, { call, put }) {
			const response = yield call(doGetProductList, payload);
			return response
		},
		// 详情获取(连连)
        *getetProductDetail({ payload }, { call, put }) {
			const response = yield call(doGetProductDetail, payload);
			return response
		},
		// 周边券更新
        *getExtendcouponUpdate({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponUpdate, payload);
			return response
		},
		// 服务订单列表
        *getExtEndcouponorderList({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponorderList, payload);
			return response
		},
		// 服务订单列表（退款）
        *getExtendcouponorderRefund({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponorderRefund, payload);
			return response
		},
		// 服务订单列表（取消订单）
        *getExtendcouponorderCancelOrder({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponorderCancelOrder, payload);
			return response
		},
		
		// 服务订单核销码（添加）
		*getExtendcouponorderAddCheckCode({ payload }, { call, put }) {
			const response = yield call(doGetExtendcouponorderAddCheckCode, payload);
			return response
		}
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, { payload }) {
			return { ...state, ...payload };
		},
	},
	subscriptions: {},
};
export default Model;
