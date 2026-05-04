import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

import Constants from 'expo-constants';

// Auto-detect correct base URL based on platform
const getBaseURL = () => {
    // Priority 1: Production URL from app.json extra (checks multiple paths)
    const productionURL = Constants.expoConfig?.extra?.apiUrl || Constants.expoConfig?.extra?.eas?.apiUrl;
    
    if (productionURL) {
        console.log('[Axios] Target API:', productionURL);
        return productionURL;
    }

    console.warn('[Axios] Production URL not found, falling back to local IP detection.');

    // Priority 2: Manual override
    const OVERRIDE_IP = null;

    if (Platform.OS === 'web') {
        return 'http://localhost:5000/api';
    }
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api';
    }
    
    const ip = OVERRIDE_IP || '192.168.29.82';
    return `http://${ip}:5000/api`;
};

const BASE_URL = getBaseURL();

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000, // 30s timeout for Render cold starts
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
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message || 'Something went wrong';
        
        console.error(`[Axios Error] Status: ${status} | Message: ${message}`);
        
        if (status === 502) {
            console.error('[Axios Error] 502 Bad Gateway: The server is likely struggling to start or is temporarily overloaded.');
        }

        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;
