/* eslint-disable no-param-reassign */
import {
    doGetOilList,
    doGetInsureList,
    doGetGoodsList,
	doGetServiceList,
    doGetServiceCategoryList,
    doGetLocalLifePagelistForPlatForm,
    doGetComboDetailByOrderId
} from '../services';

// 数据直接通过protable放入表单中 并不需要redux层 这里主要是为了处理导出

const Model = {
	namespace: 'order',
	state: {
        oil: [],
        insure: [],
        goods: [],
        service: [],
        serviceList: []
	},
	effects: {
        // 加油
        *getOilList({ payload }, { call, put }) {
            const response = yield call(doGetOilList, payload);
			if (response && ['0000','1011'].includes(response.code)) {
                console.log('response', response)
                yield put({
                    type:'save',
                    payload:{
                        oil:response.data
                    }
                })
                let { pages, size, current, total } = response
                return {
                    data: response.data,
                    current,
                    pageSize: size,
                    total
                }
            }
        },
        // 服务
        *getServiceList({ payload }, { call, put }) {
            const response = yield call(doGetServiceList, payload);
            if (response && ['0000','1011'].includes(response.code)) {
                yield put({
                    type:'save',
                    payload:{
                        service:response.data
                    }
                })
                let { pages, size, current, total } = response
                return {
                    data: response.data,
                    current,
                    pageSize: size,
                    total
                }
            }
        },
        // 兑换
        *getGoodsList({ payload }, { call, put }) {
            const response = yield call(doGetGoodsList, payload);
            if (response && ['0000','1011'].includes(response.code)) {
                yield put({
                    type:'save',
                    payload:{
                        goods:response.data
                    }
                })
                let { pages, size, current, total } = response
                return {
                    data: response.data,
                    current,
                    pageSize: size,
                    total
                }
            }
        },
        // 兑换
        *getInsureList({ payload }, { call, put }) {
            const response = yield call(doGetInsureList, payload);
            if (response && ['0000','1011'].includes(response.code)) {
                yield put({
                    type:'save',
                    payload:{
                        insure:response.data
                    }
                })
                let { pages, size, current, total } = response
                return {
                    data: response.data,
                    current,
                    pageSize: size,
                    total
                }
            }
        },
        // 服务类型
        *getServiceCategoryList({ payload }, { call, put }) {
            const response = yield call(doGetServiceCategoryList);
            if ( response && response.data ) {
                yield put({
                    type:'save',
                    payload:{
                        serviceList: response.data
                    }
                })
            }
        },
        // 分销订单
        *getLocalLifePagelistForPlatForm({ payload }, { call, put }) {
            const response = yield call(doGetLocalLifePagelistForPlatForm,payload);
            if ( response && response.data ) {
                let { pages, size, current, total } = response
                return {
                    data: response.data,
                    current,
                    pageSize: size,
                    total
                }
            }
       },
       //套餐展示
        *getComboDetailByOrderId({ payload }, { call, put }) {
            const response = yield call(doGetComboDetailByOrderId,payload);
            return response
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
                if (pathname.indexOf('order/serviceOrder') !== -1) {
                    dispatch({
                        type: 'getServiceCategoryList',
                    });
                }
            });
        },
    },
};
export default Model;
