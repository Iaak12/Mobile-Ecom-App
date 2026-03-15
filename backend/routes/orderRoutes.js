const express = require('express');
const router = express.Router();
const {
    createOrder, createRazorpayOrder, verifyPayment,
    getMyOrders, getOrder, getAllOrders, updateOrderStatus,
} = require('../controllers/orderController');
const { protect, isAdmin } = require('../middlewares/auth');

router.route('/').post(protect, createOrder);
router.get('/my', protect, getMyOrders);
router.post('/razorpay', protect, createRazorpayOrder);
router.get('/admin/all', protect, isAdmin, getAllOrders);
router.route('/:id').get(protect, getOrder);
router.post('/:id/pay', protect, verifyPayment);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;
