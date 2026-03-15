import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useOrderStore = create((set) => ({
    orders: [],
    order: null,
    loading: false,
    error: null,

    placeOrder: async (orderData) => {
        set({ loading: true });
        try {
            const { data } = await axiosInstance.post('/orders', orderData);
            set({ loading: false });
            return { success: true, order: data.order };
        } catch (err) {
            set({ loading: false });
            return { success: false, message: err.message };
        }
    },

    fetchMyOrders: async () => {
        set({ loading: true });
        try {
            const { data } = await axiosInstance.get('/orders/my');
            set({ orders: data.orders, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchOrder: async (id) => {
        set({ loading: true, order: null });
        try {
            const { data } = await axiosInstance.get(`/orders/${id}`);
            set({ order: data.order, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    // Admin
    fetchAllOrders: async (params = {}) => {
        set({ loading: true });
        try {
            const { data } = await axiosInstance.get('/orders/admin/all', { params });
            set({ orders: data.orders, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    updateOrderStatus: async (id, status) => {
        try {
            const { data } = await axiosInstance.put(`/orders/${id}/status`, { status });
            return { success: true, order: data.order };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },
}));

export default useOrderStore;
