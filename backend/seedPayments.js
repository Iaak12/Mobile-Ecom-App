require('dotenv').config();
const mongoose = require('mongoose');
const PaymentMethod = require('./models/PaymentMethod');
const connectDB = require('./config/db');

const seedPayments = async () => {
    try {
        await connectDB();

        const methods = [
            {
                name: 'Razorpay',
                type: 'gateway',
                isEnabled: false,
                config: { mode: 'sandbox' },
                displayOrder: 1
            },
            {
                name: 'PayPal',
                type: 'gateway',
                isEnabled: false,
                config: { mode: 'sandbox' },
                displayOrder: 2
            },
            {
                name: 'UPI',
                type: 'direct',
                isEnabled: false,
                config: { vpa: '', payeeName: '' },
                displayOrder: 3
            }
        ];

        for (const m of methods) {
            await PaymentMethod.findOneAndUpdate(
                { name: m.name },
                m,
                { upsert: true, new: true }
            );
        }

        console.log('Payment methods seeded successfully');
        process.exit();
    } catch (err) {
        console.error('Error seeding payment methods:', err);
        process.exit(1);
    }
};

seedPayments();
