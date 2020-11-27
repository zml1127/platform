import request from '@/utils/request';
import CONST from '@/services/CONST';

const { URL } = CONST

export async function accountLogin(data) {
    return request(`${URL}/user/account/login`, {
        method: 'POST',
        data,
        isLogin:true
    });
}

export async function accountLogout() {
    return request(`${URL}/user/account/logOut`, {
        method: 'GET',
    });
}

export async function getUserInfo() {
    return request(`${URL}/user/account/getUserInfo`, {
        method: 'GET',
    });
}