import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useCMSStore = create((set) => ({
    homeContent: { banners: [], sections: [] },
    loading: false,
    error: null,

    fetchHomeContent: async () => {
        set({ loading: true, error: null });
        try {
            const { data } = await axiosInstance.get('/cms/home');
            if (data.success) {
                set({ homeContent: data.content, loading: false });
            }
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));

export default useCMSStore;
