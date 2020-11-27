/* eslint-disable no-param-reassign */
import {
	doGetAgentList,
	doEditBankCard,
    doGetWhiteList,
	doGetBankList,
    doGetCityList,
    doGetCardList
} from '../services';

const Model = {
	namespace: 'insure',
	state: {
		agentList: [],
        whiteList: [],
        bankList: [],
        cityList: [],
        currentCard: {},
	},
	effects: {
		// 获取代理人列表
		*getAgentList({ payload }, { call, put }) {
            payload.page_size = payload.pageSize;
            delete payload.pageSize;
			const response = yield call(doGetAgentList, payload);

			if (response && ['0000','1011'].includes(response.code)) {
                yield put({
                    type:'save',
                    payload:{
                        orderList:response.data
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
        // 编辑
        *editBankCard({ payload }, { call, put }) {
            const response = yield call(doEditBankCard, payload);

			if (response && ['0000','1011'].includes(response.code)) {
                yield put({
                    type:'save',
                    payload:{
                        orderList:response.data
                    }
                })
            }
            if (response && response.code === '0000') {
                return response
            }

        },
		// 获取白名单
		*getWhiteList({ payload }, { call, put }) {
			const response = yield call(doGetWhiteList);
			if (response && response.code === '0000') {
				yield put({
					type:'save',
					payload:{
						whiteList:response.data
					}
				})
			}
			return response;
		},
        // 获取银行
        *getBankList({ payload }, { call, put }) {
            // 获取省市区数据
            const response = yield call(doGetBankList);
            if (response && response.code === '0000') {
                yield put({
                    type:'save',
                    payload:{
                        bankList:response.data
                    }
                })
            }
            return response;
        },
        // 获取银行卡信息
        *getCardInfo({ payload }, { call, put }) {
            let { user_id } = payload;
            // 获取省市区数据
            const response = yield call(doGetCardList, payload);
            if (response && response.code === '0000') {
                let currentCard = response.data[0] || {}
                currentCard.userId = user_id
                yield put({
                    type:'save',
                    payload:{
                        currentCard
                    }
                })
            }
            return response;
        },

        // 获取省市
        *getCityList({ payload }, { call, put }) {
            // 获取省市区数据
            const response = yield call(doGetCityList);
            if (response && response.code === '0000') {
                yield put({
                    type:'save',
                    payload:{
                        cityList:response.data
                    }
                })
            }
            return response;
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
                if (pathname.indexOf('insure/agent') !== -1) {
                    dispatch({
                        type: 'getWhiteList',
                    });
                    dispatch({
                        type: 'getBankList',
                    });
                    dispatch({
                        type: 'getCityList',
                    });
                }
            });
        },
    },
};
export default Model;
