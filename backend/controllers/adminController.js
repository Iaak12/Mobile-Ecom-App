const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc  Get admin dashboard stats
// @route GET /api/admin/stats
const getDashboardStats = asyncHandler(async (req, res) => {
    const [totalUsers, totalProducts, totalOrders, orders] = await Promise.all([
        User.countDocuments({ role: 'user' }),
        Product.countDocuments({ isActive: true }),
        Order.countDocuments(),
        Order.find({}).select('totalPrice status'),
    ]);

    const totalRevenue = orders.filter((o) => o.isPaid).reduce((acc, o) => acc + o.totalPrice, 0);
    const pendingOrders = orders.filter((o) => o.status === 'Processing').length;

    res.json({
        success: true,
        stats: { totalUsers, totalProducts, totalOrders, totalRevenue, pendingOrders },
    });
});

// @desc  Get all users (Admin)
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json({ success: true, users });
});

// @desc  Update user role (Admin)
// @route PUT /api/admin/users/:id
const updateUserRole = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true });
    if (!user) { res.status(404); throw new Error('User not found'); }
    res.json({ success: true, user });
});

// @desc  Delete user (Admin)
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) { res.status(404); throw new Error('User not found'); }
    await User.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'User deactivated' });
});

module.exports = { getDashboardStats, getAllUsers, updateUserRole, deleteUser };
