import request from '../utils/request';

export interface RegisterParams {
    nickname: string;
    email: string;
    password: string;
    gender: 'female' | 'male' | 'other';
}

export interface LoginParams {
    email: string;
    password: string;
}

export interface UserInfo {
    id: string;
    nickname: string;
    email: string;
    gender: string;
    avatar?: string;
    access_token: string;
    refresh_token: string;
}

export const registerApi = (params: RegisterParams): Promise<UserInfo> => {
    return request.post('/api/v1/auth/register', params);
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