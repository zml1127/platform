import {
	doGetUserList,
	doGetUserById,
	doUpdateUserStatus,
    doCreateUser,
    doUpdateUser,
	doDeleteUser,
	// doUpdatePassword
} from '../services/index';

const Model = {
	namespace: 'admin',
	state: {
        current: {}
    },
	effects: {
		 // 获取角色列表
        *getUserList({ payload }, { call, put }) {
            const response = yield call(doGetUserList, {current:1,pagesize:10000});
            if (response.code === '0000') {
                // 这个接口返回值 当前页用的pages 页面条数用的size 改成protable固定字段
                let { pages, size, data } = response;
                return { pageSize: size, current: pages, data}
            }
        },
        // 获取角色详情
        *getUserById({ payload }, { call, put }) {
            if ( payload.id ) {
                const response = yield call(doGetUserById, payload);
                if (response.code === '0000') {
                    yield put({
                        type:'save',
                        payload:{
                            current: response.data
                        }
                    })
                }
            } else {
                yield put({
                    type:'save',
                    payload:{
                        current: {}
                    }
                })
            }
        },
        // 修改角色状态
        *toggleUser({ payload }, { call, put }) {
            const response = yield call( doUpdateUserStatus, payload );

            if (response.code === '0000') {
                return response
            }
        },
        // 添加角色
        *createUser({ payload }, { call, put }) {
            const response = yield call( doCreateUser, {...payload, type: 1} );

            if (response.code === '0000') {
                return response
            }
        },
        // 编辑
        *updateUser({ payload }, { call, put }) {
            const response = yield call( doUpdateUser, payload );

            if (response.code === '0000') {
                return response
            }
        },
        // 删除角色
        *deleteUser({ payload }, { call, put }) {
            const response = yield call( doDeleteUser, payload );

            if (response.code === '0000') {
                console.log('response', response)
            }
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
                    const { pathname, query } = history.location;
                    let { id } = query;
                    if (pathname.includes('system/admin/detail')) {
                        dispatch({
                            type: 'getUserById',
                            payload: { id }
                        });
                    }
                });
            },
        },
};
export default Model;
