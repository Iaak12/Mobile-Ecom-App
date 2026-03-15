const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding...');

    const adminEmail = 'Ayazapp@admin12';
    const adminPassword = 'Ayazapp1201@admin12';

    // Check if user already exists
    const userExists = await User.findOne({ email: adminEmail });

    if (userExists) {
      console.log('Admin user already exists. Updating password and role...');
      userExists.password = adminPassword;
      userExists.role = 'admin';
      userExists.isActive = true;
      await userExists.save();
      console.log('Admin user updated successfully.');
    } else {
      console.log('Creating new admin user...');
      await User.create({
        name: 'Ayaz Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });
      console.log('Admin user created successfully.');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
