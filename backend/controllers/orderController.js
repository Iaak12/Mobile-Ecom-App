const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc  Create order
// @route POST /api/orders
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod } = req.body;
    if (!orderItems || orderItems.length === 0) {
        res.status(400); throw new Error('No order items');
    }
    const itemsPrice = orderItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
    const shippingPrice = itemsPrice > 999 ? 0 : 49;
    const taxPrice = Math.round(itemsPrice * 0.18 * 100) / 100;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    const order = await Order.create({
        user: req.user._id, orderItems, shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        itemsPrice, shippingPrice, taxPrice, totalPrice,
    });
    // Clear cart after order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
    res.status(201).json({ success: true, order });
});

// @desc  Get Razorpay order
// @route POST /api/orders/razorpay
const createRazorpayOrder = asyncHandler(async (req, res) => {
    const { amount } = req.body;
    const options = { amount: Math.round(amount * 100), currency: 'INR', receipt: `receipt_${Date.now()}` };
    const razorpayOrder = await razorpay.orders.create(options);
    res.json({ success: true, order: razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
});

// @desc  Verify Razorpay payment
// @route POST /api/orders/:id/pay
const verifyPayment = asyncHandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');
    if (expectedSignature !== razorpay_signature) {
        res.status(400); throw new Error('Payment verification failed');
    }
    const order = await Order.findByIdAndUpdate(req.params.id, {
        isPaid: true, paidAt: Date.now(), status: 'Confirmed',
        paymentInfo: { razorpay_order_id, razorpay_payment_id, razorpay_signature },
    }, { new: true });
    res.json({ success: true, order });
});

// @desc  Get my orders
// @route GET /api/orders/my
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
});

// @desc  Get order by id
// @route GET /api/orders/:id
const getOrder = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) { res.status(404); throw new Error('Order not found'); }
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403); throw new Error('Not authorized');
    }
    res.json({ success: true, order });
});

// @desc  Get all orders (Admin)
// @route GET /api/orders/admin/all
const getAllOrders = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const total = await Order.countDocuments();
    const orders = await Order.find({})
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
    res.json({ success: true, page, pages: Math.ceil(total / limit), total, orders });
});

// @desc  Update order status (Admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {
        status,
        ...(status === 'Delivered' ? { isDelivered: true, deliveredAt: Date.now() } : {}),
    }, { new: true });
    if (!order) { res.status(404); throw new Error('Order not found'); }
    res.json({ success: true, order });
});

module.exports = { createOrder, createRazorpayOrder, verifyPayment, getMyOrders, getOrder, getAllOrders, updateOrderStatus };
