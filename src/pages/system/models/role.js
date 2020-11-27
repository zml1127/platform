import {
    doGetRoleList,
    doGetRoleById,
    doUpdateRoleStatus,
    doCreateRole,
    doUpdateRole,
    doDeleteRole
} from '../services';

const Model = {
    namespace: 'role',
	state: {
        roleList: [],
        filterRole: [],
        current: {}
	},
	effects: {
	    // 获取角色列表
        *getRoleList({ payload }, { call, put }) {
            const response = yield call(doGetRoleList, {...payload, pageSize: 9999, platformType: 1});
            if (response.code === '0000') {
                // 这个接口返回值 当前页用的pages 页面条数用的size 改成protable固定字段
                let {data} = response
                 yield put({
                    type:'save',
                    payload:{
                        roleList: data
                    }
                })
                let { pages, size } = response;
                return { ...response, pageSize: size, current: pages}
            }
        },
        // 获取角色详情
        *getRoleById({ payload }, { call, put }) {
            if ( payload.id ) {
                const response = yield call(doGetRoleById, payload);
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
        *toggleRole({ payload }, { call, put }) {
            const response = yield call( doUpdateRoleStatus, payload );

            if (response.code === '0000') {
                return response
            }
        },
        // 添加
        *createRole({ payload }, { call, put }) {
            const response = yield call( doCreateRole, payload );

            if (response.code === '0000') {
                return response
            }
        },
        // 编辑
        *updateRole({ payload }, { call, put }) {
            const response = yield call( doUpdateRole, payload );

            if (response.code === '0000') {
                return response
            }
        },
        // 删除角色
        *deleteRole({ payload }, { call, put }) {
            const response = yield call( doDeleteRole, payload );

            if (response.code === '0000') {
                return response
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
                const { pathname, query } = history.location;
                if (pathname.indexOf('system/admin/detail') !== -1) {
                    dispatch({
                        type: 'getRoleList'
                    });
                }
                    let { id } = query;
                if (pathname.includes('system/role/detail')) {
                    dispatch({
                        type: 'getRoleById',
                        payload: { id }
                    });
                }
            });
        },
    },
};
export default Model;
