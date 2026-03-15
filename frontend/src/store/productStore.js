import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useProductStore = create((set) => ({
    products: [],
    product: null,
    loading: false,
    error: null,
    page: 1,
    pages: 1,
    total: 0,
    categories: [],

    fetchProducts: async (params = {}) => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosInstance.get('/products', { params });
            set({ products: data.products, page: data.page, pages: data.pages, total: data.total, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true, error: null, product: null });
        try {
            const { data } = await axiosInstance.get(`/products/${id}`);
            set({ product: data.product, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    fetchCategories: async () => {
        try {
            const { data } = await axiosInstance.get('/categories');
            set({ categories: data.categories });
        } catch { }
    },

    clearProduct: () => set({ product: null }),
}));

export default useProductStore;
