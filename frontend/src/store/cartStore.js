import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useCartStore = create((set, get) => ({
    items: [],
    total: 0,
    loading: false,

    fetchCart: async () => {
        set({ loading: true });
        try {
            const { data } = await axiosInstance.get('/cart');
            const items = data.cart?.items || [];
            const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
            set({ items, total, loading: false });
        } catch {
            set({ loading: false });
        }
    },

    addToCart: async (productId, quantity = 1) => {
        try {
            const { data } = await axiosInstance.post('/cart', { productId, quantity });
            const items = data.cart?.items || [];
            const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
            set({ items, total });
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },

    updateQuantity: async (itemId, quantity) => {
        try {
            const { data } = await axiosInstance.put(`/cart/${itemId}`, { quantity });
            const items = data.cart?.items || [];
            const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
            set({ items, total });
        } catch { }
    },

    removeItem: async (itemId) => {
        try {
            const { data } = await axiosInstance.delete(`/cart/${itemId}`);
            const items = data.cart?.items || [];
            const total = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
            set({ items, total });
        } catch { }
    },

    clearCart: async () => {
        try {
            await axiosInstance.delete('/cart');
            set({ items: [], total: 0 });
        } catch { }
    },

    getCount: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
}));

export default useCartStore;
