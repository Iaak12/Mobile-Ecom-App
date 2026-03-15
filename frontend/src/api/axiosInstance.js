import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Auto-detect correct base URL based on platform
const getBaseURL = () => {
    // Priority: Manual override (Useful for debugging certain IPs)
    const OVERRIDE_IP = null; // e.g., '192.168.1.5'

    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api';
    }
    if (Platform.OS === 'android') {
        // 10.0.2.2 is the standard loopback to host for Android emulator
        return 'http://10.0.2.2:5000/api';
    }
    
    // For iOS simulator and real devices on the same network
    const ip = OVERRIDE_IP || '192.168.29.82';
    return `http://${ip}:5000/api`;
};

const BASE_URL = getBaseURL();
console.log('[Axios] API Base URL:', BASE_URL);

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
});

// Request interceptor — attach token
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
