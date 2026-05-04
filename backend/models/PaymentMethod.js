const mongoose = require('mongoose');

const paymentMethodSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true }, // Razorpay, PayPal, UPI
        type: { type: String, enum: ['gateway', 'direct'], required: true },
        isEnabled: { type: Boolean, default: false },
        config: {
            apiKey: String,
            apiSecret: String,
            merchantId: String,
            vpa: String, // For UPI
            payeeName: String, // For UPI
            mode: { type: String, enum: ['sandbox', 'live'], default: 'sandbox' },
        },
        displayOrder: { type: Number, default: 0 },
        logo: String,
    },
    { timestamps: true }
);

module.exports = mongoose.model('PaymentMethod', paymentMethodSchema);
