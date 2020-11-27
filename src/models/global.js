import { queryNotices,doGetCityList, doGetStsToken } from '@/services/user';
import { message } from 'antd';
import { Children } from 'react';

const GlobalModel = {
	namespace: 'global',
	state: {
		collapsed: false,
		notices: [],
		cityList: [],
		cityListBasic:[],
		cityListUser:[]
	},
	effects: {
		// 获取省市区
		*getCityList({ payload }, { call, put }) {
			const response = yield call(doGetCityList, {});
			if (response && response.code === '0000') {
				const tempPosition=response.data?JSON.parse(JSON.stringify(response.data).replace(/\[\]/g,null)):[];
				
				const str2='children":[{"name":"全部","provinceCityCode":null,"pid":null,"id":null},';
				
				const tempPosition3=JSON.parse(JSON.stringify(tempPosition).replace(/children":\[/g,str2));


				tempPosition3.unshift({"name":"全部","provinceCityCode":null,"pid":null,"id":null})

				const userPosition = response.data.concat([])
                if(userPosition){
					userPosition.forEach(item => {
						item.children.forEach(it=>{
							delete it.children
						})
					})
				}
				yield put({
					type:'save',
					payload: ['cityList', tempPosition3]
				})
				yield put({
					type:'save',
					payload: ['cityListBasic', tempPosition]
				})
				yield put({
					type:'save',
					payload: ['cityListUser', userPosition]
				})
				return response;
			}
		},
		*fetchNotices(_, { call, put, select }) {
			const data = yield call(queryNotices);
			yield put({
				type: 'saveNotices',
				payload: data,
			});
			const unreadCount = yield select(
				state => state.global.notices.filter(item => !item.read).length,
			);
			yield put({
				type: 'user/changeNotifyCount',
				payload: {
					totalCount: data.length,
					unreadCount,
				},
			});
		},

		*clearNotices({ payload }, { put, select }) {
			yield put({
				type: 'saveClearedNotices',
				payload,
			});
			const count = yield select(state => state.global.notices.length);
			const unreadCount = yield select(
				state => state.global.notices.filter(item => !item.read).length,
			);
			yield put({
				type: 'user/changeNotifyCount',
				payload: {
					totalCount: count,
					unreadCount,
				},
			});
		},
		*getStsToken({}, { call, put }) {
			const response = yield call(doGetStsToken);

			if (response && response.code === '0000') {
				yield put({
					type: 'save',
					payload: ['ossToken', response.data],
				});
				return response;
			}
		},
		*changeNoticeReadState({ payload }, { put, select }) {
			const notices = yield select(state =>
				state.global.notices.map(item => {
					const notice = { ...item };

					if (notice.id === payload) {
						notice.read = true;
					}

					return notice;
				}),
			);
			yield put({
				type: 'saveNotices',
				payload: notices,
			});
			yield put({
				type: 'user/changeNotifyCount',
				payload: {
					totalCount: notices.length,
					unreadCount: notices.filter(item => !item.read).length,
				},
			});
		},
		
	},
	reducers: {
		save(state, action) {
			const [key, value] = action.payload;
			state[key] = value;
			return state
		},
		changeLayoutCollapsed(
			state = {
				notices: [],
				collapsed: true,
			},
			{ payload },
		) {
			return { ...state, collapsed: payload };
		},

		saveNotices(state, { payload }) {
			return {
				collapsed: false,
				...state,
				notices: payload,
			};
		},

		saveClearedNotices(
			state = {
				notices: [],
				collapsed: true,
			},
			{ payload },
		) {
			return {
				...state,
				collapsed: false,
				notices: state.notices.filter(item => item.type !== payload),
			};
		},
	},
	subscriptions: {
		setup({ history,dispatch }) {
			// Subscribe history(url) change, trigger `load` action if pathname is `/`
			history.listen(({ pathname, search }) => {
				if (typeof window.ga !== 'undefined') {
					window.ga('send', 'pageview', pathname + search);
				}
			});
		},
	},
};
export default GlobalModel;
