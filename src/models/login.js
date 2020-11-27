import { stringify } from 'querystring';
import { history } from 'umi';
import { 
	accountLogin,
	accountLogout
} from '@/services/login';
import { getPageQuery } from '@/utils/utils';

const Model = {
	namespace: 'login',
	state: {
		userInfo:{}
	},
	effects: {
		*login({ payload }, { call, put }) {
			const response = yield call(accountLogin, {...payload, type: 1});



			if (response.code === '0000') {
				let { token } = response.data
  				localStorage.setItem('platform_token', token); // auto reload
				const urlParams = new URL(window.location.href);
				const params = getPageQuery();
				let { redirect } = params;

				if (redirect) {
					const redirectUrlParams = new URL(redirect);

					if (redirectUrlParams.origin === urlParams.origin) {
						redirect = redirect.substr(urlParams.origin.length);

						if (redirect.match(/^\/.*#/)) {
							redirect = redirect.substr(redirect.indexOf('#') + 1);
						}
					} else {
						window.location.href = '/';
						return;
					}
				}

				history.replace(redirect || '/');
			}
		},

		*logout({ payload }, { call }) {
			const response = yield call(accountLogout);
			if (response) {
				const { redirect } = getPageQuery(); // Note: There may be security issues, please note
				localStorage.clear()

				if (window.location.pathname !== '/user/login' && !redirect) {
					history.replace({
						pathname: '/user/login',
						search: stringify({
							redirect: window.location.href,
						}),
					});
				}
			}

		},
	},
	reducers: {
		changeLoginStatus(state, { payload }) {

		},
	},
};
export default Model;
