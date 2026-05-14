import { create } from 'zustand';
import { storage } from '../utils/storage';
import { setToken, setRefreshToken } from '../utils/request';
import { UserInfo, loginApi, registerApi, logoutApi } from '../api/auth';

interface AuthState {
    user: UserInfo | null;
    token: string | null;
    isLoading: boolean;
    isLoggedIn: boolean;
    loadFromStorage: () => Promise<void>;
    login: (phone: string, password: string) => Promise<void>;
    register: (params: {
        nickname: string;
        email: string;
        password: string;
        gender: 'female' | 'male' | 'other';
    }) => Promise<void>;
    logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    isLoggedIn: false,

    loadFromStorage: async () => {
        const token = await storage.getString('token');
        const refreshToken = await storage.getString('refresh_token');
        const userStr = await storage.getString('user');
        if (token && userStr) {
            setToken(token);
            if (refreshToken) setRefreshToken(refreshToken);
            set({
                token,
                user: JSON.parse(userStr),
                isLoggedIn: true,
            });
        }
    },

    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const data = await loginApi({ email, password });
            await storage.set('token', data.access_token);
            await storage.set('refresh_token', data.refresh_token);
            await storage.set('user', JSON.stringify(data));
            setToken(data.access_token);
            setRefreshToken(data.refresh_token);
            set({ user: data, token: data.access_token, isLoggedIn: true });
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (params) => {
        set({ isLoading: true });
        try {
            const data = await registerApi(params);
            await storage.set('token', data.access_token);
            await storage.set('refresh_token', data.refresh_token);
            await storage.set('user', JSON.stringify(data));
            setToken(data.access_token);
            setRefreshToken(data.refresh_token);
            set({ user: data, token: data.access_token, isLoggedIn: true });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        set({ isLoading: true });
        try {
            await logoutApi();
        } catch (_) {
        } finally {
            await storage.delete('token');
            await storage.delete('refresh_token');
            await storage.delete('user');
            setToken(null);
            setRefreshToken(null);
            set({ user: null, token: null, isLoggedIn: false, isLoading: false });
        }
    },
}));