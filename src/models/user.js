import { queryCurrent, query as queryUsers } from '@/services/user';
import { getUserInfo } from '@/services/login';
import { setAuthority } from '@/utils/authority';

const UserModel = {
	namespace: 'user',
	state: {
		currentUser: {
  			id: localStorage.getItem('platform_token') || null
		}
	},
	effects: {
		*fetchCurrent(_, { call, put }) {
			const response = yield call(getUserInfo);
			if ( response.code === '0000' ) {
				let { authorizeList, roleId } = response.data
  				localStorage.setItem('roleId', roleId); // auto reload
				setAuthority(authorizeList)
				yield put({
					type: 'save',
					payload: {
						currentUser:response.data,
					}
				})
			}
		},
	},
	reducers: {
		//用来修改数据模型的state。
		save(state, { payload }) {
			return { ...state, ...payload };
		},
	},
};
export default UserModel;
