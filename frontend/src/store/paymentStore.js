import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const usePaymentStore = create((set) => ({
    methods: [],
    loading: false,

    // Fetch only enabled payment methods from backend
    fetchEnabledMethods: async () => {
        set({ loading: true });
        try {
            const { data } = await axiosInstance.get('/payments/methods');
            const enabled = (data.methods || []).filter(m => m.isEnabled);
            set({ methods: enabled, loading: false });
        } catch (err) {
            console.error('Failed to fetch payment methods:', err.message);
            // Fallback to COD only if API fails
            set({
                methods: [{ _id: 'cod', name: 'Cash on Delivery', type: 'direct', isEnabled: true }],
                loading: false,
            });
        }
    },

    // Create a Razorpay order on the backend
    createRazorpayOrder: async (amount) => {
        try {
            const { data } = await axiosInstance.post('/orders/razorpay', { amount });
            return { success: true, ...data };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },

    // Verify Razorpay payment signature with backend
    verifyRazorpayPayment: async (orderId, paymentData) => {
        try {
            const { data } = await axiosInstance.post(`/orders/${orderId}/pay`, paymentData);
            return { success: true, order: data.order };
        } catch (err) {
            return { success: false, message: err.message };
        }
    },
}));

export default usePaymentStore;
