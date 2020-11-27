/* eslint-disable no-param-reassign */
import {
	doGetMerchantList,
	doGetMerchantGoodsList,
	doGetMerchantById,
	doGetMerchantserviceTag,
	doGetMerchantspecialTag,// 特色标签
	doPostMerchantUpdate,// 店铺编辑 更细 
	doPostMerchantCreate,// 店铺 新增
	doPostMerchantByIds,
	doGetOilMerchantId,
	doGetSpellGroup,// 拼团
	doGetCouponGroup, // 优惠券
	doGetUpdateIsSeed,//设置为种子、普通用户
	doGetMerchantType, // 商户服务类型
} from '@/services/merchant';

const Model = {
	state: {
		typeList: [],
		typeMap: {}
	},
	effects: {
		// // 获取商户列表
        *getMerchantList({ payload }, { call }) {
			const response = yield call(doGetMerchantList, payload);
			if (response) {
				return {
					data: response.data,
					page: payload.current,
					total: response.total,
				};
			}
			return response;
		},
		// 商品券里获取商户列表
		*getMerchantGoodsList({ payload }, { call }) {
			const response = yield call(doGetMerchantGoodsList, payload);
			if (response) {
				return {
					data: response.data,
					// page: payload.current,
					total: response.total,
				};
			}
			// return response;
		},
		// 设置为种子、普通用户
		*getUpdateIsSeed({payload}, { call }) {
			const response = yield call(doGetUpdateIsSeed, payload);
			return response
		},
		
		// 获取店铺详情
        *getMerchantId({ id }, { call }) {
			const response = yield call(doGetMerchantById, id);
			if(response.code==="0000"){
				return response.data
			}
			return false;
		},// 获取店铺服务标签 合并 店铺特色标签
        *postMerchantByIds({ ids }, { call }) {
			console.log(ids,"idsxxxyyy");
			const response = yield call(doPostMerchantByIds, ids);
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
		},// 油品列表
		*getOilMerchantId({payload}, { call }) {
			const response= yield call(doGetOilMerchantId,payload);
			if(response.code==="0000"){
					return {
						data: response.data,
						page: payload.current,
						total: response.total,
					};
			}
			return false;
		},// doGetSpellGroup
		*getSpellGroup({payload}, { call }) {
			const response= yield call(doGetSpellGroup,payload);
			if(response.code==="0000"){
					return {
						data: response.data,
						page: payload.current,
						total: response.total,
					};
			}
			return false;
		},
		*getCouponGroup({payload}, { call }) {
			const response= yield call(doGetCouponGroup,payload);
			if(response.code==="0000"){
					return {
						data: response.data,
						page: payload.current,
						total: response.total,
					};
			}
			return false;
		},
		// 店铺类型
        *getMerchantType({ payload }, { call, put, select }) {
        	const { typeList } = yield select(state => state.merchant);
        	const getTypeMap = (list) => {
			    let map = {
			        0: '全部',
			    }
			    list.forEach((item)=>{
			        map[item.id] = item.name
			    })
			    return map
			}

        	if ( typeList.length === 0 ) {
	            const response = yield call(doGetMerchantType);
	            if ( response && response.data ) {

	                yield put({
	                    type:'save',
	                    payload:{
	                    	typeList: response.data,
	                        typeMap: getTypeMap(response.data)
	                    }
	                })
	            }
        	} 
        },
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, { payload }) {
			return { ...state, ...payload };
		},
	},
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(location => {
                const { query, pathname } = history.location;
                if (pathname.indexOf('merchantManage') !== -1) {
                    dispatch({
                        type: 'getMerchantType',
                    });
                }
            });
        },
    },
};
export default Model;
