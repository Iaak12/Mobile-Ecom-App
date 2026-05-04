const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'mobileappadmin@admin';
        const adminPass = 'mobileappadmin1201@admin';

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin already exists. Updating password...');
            admin.password = adminPass; // The pre-save hook will hash it
            await admin.save();
            console.log('Admin updated successfully');
        } else {
            console.log('Creating new admin...');
            await User.create({
                name: 'System Administrator',
                email: adminEmail,
                password: adminPass,
                role: 'admin'
            });
            console.log('Admin created successfully');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin:', err);
        process.exit(1);
    }
};

seedAdmin();
