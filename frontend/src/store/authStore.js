import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosInstance';

const useAuthStore = create((set, get) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,

    // Initialize auth from storage
    initAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userStr = await AsyncStorage.getItem('user');
            if (token && userStr) {
                set({ token, user: JSON.parse(userStr), isAuthenticated: true });
            }
        } catch { }
    },

    register: async (name, email, password) => {
        set({ loading: true, error: null });
        try {
            console.log('[Auth] Attempting Register:', { name, email });
            const { data } = await axiosInstance.post('/auth/register', { name, email, password });
            console.log('[Auth] Register Success:', data.user?.email);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (err) {
            console.error('[Auth] Register Error:', err.message);
            set({ error: err.message, loading: false });
            return { success: false, message: err.message };
        }
    },

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            console.log('[Auth] Attempting Login:', email);
            const { data } = await axiosInstance.post('/auth/login', { email, password });
            console.log('[Auth] Login Success:', data.user?.email);
            await AsyncStorage.setItem('token', data.token);
            await AsyncStorage.setItem('user', JSON.stringify(data.user));
            set({ user: data.user, token: data.token, isAuthenticated: true, loading: false });
            return { success: true };
        } catch (err) {
            console.error('[Auth] Login Error:', err.message);
            set({ error: err.message, loading: false });
            return { success: false, message: err.message };
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false });
    },

    updateProfile: async (data) => {
        set({ loading: true });
        try {
            const res = await axiosInstance.put('/auth/update-profile', data);
            await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
            set({ user: res.data.user, loading: false });
            return { success: true };
        } catch (err) {
            set({ loading: false });
            return { success: false, message: err.message };
        }
    },
}));

export default useAuthStore;
