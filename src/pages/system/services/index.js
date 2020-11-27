import request from '@/utils/request';
import CONST from '@/services/CONST';

const { URL } = CONST;

// 权限
// 增
export async function doCreateRole(data) {
    return request(`${URL}/user/rbacrole/create`, {
        method: 'POST',
        data,
    });
}

// 查
export async function doGetRoleList(data) {
    return request(`${URL}/user/rbacrole/list`, {
        method: 'GET',
        data,
    });
}

// 改
export async function doUpdateRole(data) {
    return request(`${URL}/user/rbacrole/update`, {
        method: 'POST',
        data,
    });
}

// 改 状态
export async function doUpdateRoleStatus(data) {
    return request(`${URL}/user/rbacrole/updateStatus`, {
        method: 'POST',
        data
    });
}

// 删
export async function doDeleteRole(data) {
    return request(`${URL}/user/rbacrole/delete`, {
        method: 'POST',
        params:data
    });
}

// 获取某一角色信息 
export async function doGetRoleById(data) {
    return request(`${URL}/user/rbacrole/getById`, {
        method: 'GET',
        data,
    });
}


// 账户配置
// 查
export async function doGetUserList(data) {
    return request(`${ URL }/user/account/getAccountListPage`, {
        method: 'GET',
        data,
    });
}

// 改 状态
export async function doUpdateUserStatus(data) {
    return request(`${ URL }/user/account/updateStatus`, {
        method: 'POST',
        data,
    });
}


// 增
export async function doCreateUser(data) {
    return request(`${ URL }/user/account/create`, {
        method: 'POST',
        data,
    });
}

// 改
export async function doUpdateUser(data) {
    return request(`${ URL }/user/account/update`, {
        method: 'POST',
        data,
    });
}

// 删
export async function doDeleteUser(data) {
    return request(`${ URL }/user/account/delete`, {
        method: 'POST',
        params:data
    });
}

// 获取某一角色信息 
export async function doGetUserById(data) {
    return request(`${URL}/user/account/getById`, {
        method: 'GET',
        data,
    });
}

// 重置密码
export async function doUpdatePassword(data) {
    return request(`${ URL }/user/updatePassword`, {
        method: 'POST',
        params:data,
    });
}

// 日志 查
export async function doGetLogsList(data) {
    return request(`${URL}/syslog/selectLog`, {
        method: 'POST',
        data,
    });

}
