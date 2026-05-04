require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

const createAdmin = async () => {
    try {
        await connectDB();

        const email = 'mobileappadmin@admin';
        const password = 'mobileappadmin1201@admin';

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            name: 'Master Admin',
            email,
            password: hashedPassword,
            role: 'admin',
            isActive: true
        });

        console.log('Admin user created successfully');
        process.exit();
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
