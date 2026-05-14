import axios, { AxiosResponse } from 'axios';
import i18n from '../i18n';
import Config from 'react-native-config';

export const BASE_URL = Config.API_BASE_URL;
// export const BASE_URL = 'http://100.67.38.57:8080';

let cachedToken: string | null = null;
let cachedRefreshToken: string | null = null;

export const setToken = (token: string | null) => {
    cachedToken = token;
};

export const setRefreshToken = (token: string | null) => {
    cachedRefreshToken = token;
};

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token!);
    });
    failedQueue = [];
};

const doRefreshToken = async (): Promise<string> => {
    if (!cachedRefreshToken) throw new Error(i18n.t('request.noRefreshToken'));
    const response = await axios.post(`${BASE_URL}/v1/auth/refresh`, {
        refresh_token: cachedRefreshToken,
    });
    const { access_token, refresh_token: new_refresh_token } = response.data.data;
    setToken(access_token);
    setRefreshToken(new_refresh_token);
    const { storage } = require('./storage');
    await storage.set('token', access_token);
    await storage.set('refresh_token', new_refresh_token);
    return access_token;
};

request.interceptors.request.use(
    config => {
        if (cachedToken) {
            config.headers.Authorization = `Bearer ${cachedToken}`;
        }
        return config;
    },
    error => Promise.reject(error),
);

request.interceptors.response.use(
    (response: AxiosResponse) => {
        const { code, data, message } = response.data;
        if (code === 200 || code === 0) {
            return data;
        }
        return Promise.reject(new Error(message || i18n.t('request.failed')));
    },
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return request(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await doRefreshToken();
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return request(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                setToken(null);
                setRefreshToken(null);
                const { storage } = require('./storage');
                await storage.delete('token');
                await storage.delete('refresh_token');
                await storage.delete('user');
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response) {
            switch (error.response.status) {
                case 403:
                    return Promise.reject(new Error(i18n.t('request.forbidden')));
                case 404:
                    return Promise.reject(new Error(i18n.t('request.notFound')));
                case 500:
                    return Promise.reject(new Error(i18n.t('request.serverError')));
                default:
                    return Promise.reject(new Error(i18n.t('request.networkError')));
            }
        }
        if (error.code === 'ECONNABORTED') {
            return Promise.reject(new Error(i18n.t('request.timeout')));
        }
        return Promise.reject(new Error(i18n.t('request.connectionFailed')));
    },
);

export default request;