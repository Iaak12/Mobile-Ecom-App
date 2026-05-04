const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc  Register user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('Email already registered');
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
});

// @desc  Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // JIT Admin Seeding: Check if hardcoded admin credentials match
    const adminEmail = 'mobileappadmin@admin';
    const adminPass = 'mobileappadmin1201@admin';

    if (email.toLowerCase() === adminEmail && password === adminPass) {
        let admin = await User.findOne({ email: adminEmail }).select('+password');
        if (!admin) {
            console.log('JIT Seeding Admin...');
            admin = await User.create({
                name: 'System Administrator',
                email: adminEmail,
                password: adminPass,
                role: 'admin'
            });
            // Re-fetch to get password for comparison or just proceed since we know it matches
        }
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    res.json({
        success: true,
        token: generateToken(user._id),
        user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
});

// @desc  Get current user
// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

// @desc  Update profile
// @route PUT /api/auth/update-profile
const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { name, phone, avatar },
        { new: true, runValidators: true }
    );
    res.json({ success: true, user });
});

// @desc  Change password
// @route PUT /api/auth/change-password
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
        res.status(400);
        throw new Error('Current password is incorrect');
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
});

// @desc  Add address
// @route POST /api/auth/address
const addAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (req.body.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
    }
    user.addresses.push(req.body);
    await user.save();
    res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc  Delete address
// @route DELETE /api/auth/address/:addressId
const deleteAddress = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json({ success: true, addresses: user.addresses });
});

module.exports = { register, login, getMe, updateProfile, changePassword, addAddress, deleteAddress };
