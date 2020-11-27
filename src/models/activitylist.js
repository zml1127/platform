/* eslint-disable no-param-reassign */
import {
	doGetActivityList,
	doPostlistForPEJ,
	doGetCouponActivityList,
	doPostActivityPage,
	doGetpageForMerchant,// 商户胶囊
	doGetUStatus
} from '@/services/activity';

const Model = {
	state: {
		total: 0,
		enableTotal: 0,
		onlineTotal: 0,
	},
	effects: {
		// 获取商户列表
        *getActivityList({ payload }, { call }) {
			
			
			const response = yield call(doGetActivityList, payload);
			if (response) {
				return {
					data: response.data,
					page: response.current,
					total: response.total,
				};
			}
			return response;
		},
		//  获取活动入口列表
        *postlistForPEJ({ payload }, { call }) {

			const response = yield call(doPostlistForPEJ, payload);
			if (response) {
				const dataCurrent=response.data.map((item,index)=>{
					item.key=index+1;
					return item;
				})
				console.log(dataCurrent,"dataCurrentxxx111");
				return {
					data: dataCurrent,
					page: payload.current,
					total: response.total,
				};
			}
			return response;
		},
		//  获取活动入口列表
        *getPageForPEJMerchant({ payload }, { call }) {

			const response = yield call(doGetpageForMerchant, payload);
			if (response) {
				const dataCurrent=response.data.map((item,index)=>{
					item.key=index+1;
					return item;
				})
				console.log(dataCurrent,"dataCurrentxxx111");
				return {
					data: dataCurrent,
					page: payload.current,
					total: response.total,
				};
			}
			return response;
		},
		//  获取活动设置列表
        *postActivityPage({ payload }, { call }) {

			const response = yield call(doPostActivityPage, payload);
			if (response) {
				return {
					data: response.data,
					page: payload.current,
					total: response.total,
				};
			}
			return response;
		},
		
		// 获取优惠券列表
        *getCouponActivityList({ payload }, { call }) {
             console.log(payload,"getCouponActivityList");
			const response = yield call(doGetCouponActivityList, payload);
			if (response) {
				return {
					data: response.data,
					page: payload.current,
					total: response.total,
				};
			}
			return response;
		},
		// 更新上下线
        *doGetUStatus({ payload }, { call }) {
             console.log(payload,"getCouponActivityList");
			const response = yield call(doGetUStatus, payload);
			if (response) {
				return true
				// return {
				// 	data: response.data,
				// 	page: payload.current,
				// 	total: response.total,
				// };
			}
			return response;
		},
        
	},
	reducers: {
		save(state, action) {
			state.total = action.payload.total;
			state.onlineTotal = action.payload.onlineTotal;
			state.enableTotal = action.payload.enableTotal;
		},
	},
	subscriptions:{
		setup({  history }) {
            return history.listen(({ pathname }) => {
				// console.log(pathname,"pathname");
                // if (pathname !== '/MOA/entrance') {
                //    sessionStorage.setItem("MOAState",'1')
                //    sessionStorage.setItem("MOAState2",'1')
                // }
            });
        }
	}
};
export default Model;
