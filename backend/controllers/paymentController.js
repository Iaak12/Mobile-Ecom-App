const asyncHandler = require('express-async-handler');
const PaymentMethod = require('../models/PaymentMethod');

// @desc  Get all payment methods
// @route GET /api/payments/methods
const getPaymentMethods = asyncHandler(async (req, res) => {
    const methods = await PaymentMethod.find().sort({ displayOrder: 1 });
    res.json({ success: true, methods });
});

// @desc  Update or Create payment method (Admin)
// @route POST /api/payments/methods
const updatePaymentMethod = asyncHandler(async (req, res) => {
    const { name, type, isEnabled, config, displayOrder, logo } = req.body;

    let method = await PaymentMethod.findOne({ name });

    if (method) {
        method.type = type || method.type;
        method.isEnabled = isEnabled !== undefined ? isEnabled : method.isEnabled;
        method.config = { ...method.config, ...config };
        method.displayOrder = displayOrder !== undefined ? displayOrder : method.displayOrder;
        method.logo = logo || method.logo;
        await method.save();
    } else {
        method = await PaymentMethod.create({
            name,
            type,
            isEnabled,
            config,
            displayOrder,
            logo
        });
    }

    res.json({ success: true, method });
});

// @desc  Toggle payment method status (Admin)
// @route PUT /api/payments/methods/:id/toggle
const togglePaymentMethod = asyncHandler(async (req, res) => {
    const method = await PaymentMethod.findById(req.params.id);
    if (!method) {
        res.status(404);
        throw new Error('Payment method not found');
    }
    method.isEnabled = !method.isEnabled;
    await method.save();
    res.json({ success: true, method });
});

// @desc  Delete payment method (Admin)
// @route DELETE /api/payments/methods/:id
const deletePaymentMethod = asyncHandler(async (req, res) => {
    const method = await PaymentMethod.findByIdAndDelete(req.params.id);
    if (!method) {
        res.status(404);
        throw new Error('Payment method not found');
    }
    res.json({ success: true, message: 'Payment method deleted' });
});

module.exports = { getPaymentMethods, updatePaymentMethod, togglePaymentMethod, deletePaymentMethod };
