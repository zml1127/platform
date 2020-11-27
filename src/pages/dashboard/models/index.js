import {
    doGetPlatformData,
    doGetPlatformChart,
    doGetMerchantData,
    doGetMerchantChart,
} from '../services/index';

const Model = {
	namespace: 'dashboard',
	state: {
		platformData: {

		},
        platformChart: [],
        merchantData: {

		},
        merchantChart: [],
	},
	effects: {
		// 获取dashboard数据
		*getPlatformData({ payload }, { call, put }) {
			const response = yield call(doGetPlatformData, payload);
            if( response.code === '0000') {
                yield put({
                    type: 'save',
                    payload: {platformData: response.data},
                });
            }
            else {
                yield put({
                    type: 'save',
                    payload: {
                        errorMsg: response.msg,
                        dashboardWashData: {}
                    },
                });
            }
		},
        // 获取dashboard数据
        *getPlatformChart({ payload }, { call, put }) {
            const response = yield call(doGetPlatformChart, payload);
            if( response.code === '0000') {
                yield put({
                    type: 'save',
                    payload: {
                        platformChart: response.data
                    },
                });
            }
        },
        // 获取dashboard数据
		*getMerchantData({ payload }, { call, put }) {
            if ( !payload ) {
                yield put({
                    type: 'save',
                    payload: {merchantData: {}},
                });
                return null
            } 
            const response = yield call(doGetMerchantData, payload);
            if( response.code === '0000') {
                yield put({
                    type: 'save',
                    payload: {
                    	merchantData: response.data
                    },
                });
            }
            else {
                yield put({
                    type: 'save',
                    payload: {merchantData: {}},
                });
            }
		},
        // 获取dashboard数据
        *getMerchantChart({ payload }, { call, put }) {
            const response = yield call(doGetMerchantChart, payload);
            if( response.code === '0000') {
                yield put({
                    type: 'save',
                    payload: {
                        merchantChart: response.data
                    },
                });
            }
        },
	},
    reducers: {// 用来修改数据模型的state。
        save(state, { payload }) {
          return { ...state, ...payload };
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                // const {pathname} = history.location;
                // if (pathname.indexOf("washDashboard") !== -1) {
                //     // 获取当前id， 获取服务类型
                //     dispatch({
                //         type: 'getDashboardWashData',
                //     })
                // }
                // if (pathname.indexOf("gasDashboard") !== -1) {
                //     // 获取当前id， 获取服务类型
                //     dispatch({
                //         type: 'getDashboardOilData',
                //     })
                // }
            });
        },
    }
};
export default Model;
