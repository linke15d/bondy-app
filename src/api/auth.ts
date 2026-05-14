import request from '../utils/request';

export interface RegisterParams {
    nickname: string;
    phone: string;
    password: string;
    gender: 'female' | 'male' | 'other';
}

export interface LoginParams {
    phone: string;
    password: string;
}

export interface UserInfo {
    id: string;
    nickname: string;
    phone: string;
    gender: string;
    avatar?: string;
    access_token: string;
    refresh_token: string;
}

export const registerApi = (params: RegisterParams): Promise<UserInfo> => {
    return request.post('/v1/auth/register', params);
};

export const loginApi = (params: LoginParams): Promise<UserInfo> => {
    return request.post('/v1/auth/login', params);
};

export const getUserInfoApi = (): Promise<UserInfo> => {
    return request.get('/v1/auth/profile');
};

export const logoutApi = (): Promise<void> => {
    return request.post('/v1/auth/logout');
};