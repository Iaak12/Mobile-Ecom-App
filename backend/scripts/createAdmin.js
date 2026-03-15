require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ── Admin credentials — change these if you want ──────────────────────────────
const ADMIN_NAME = 'Admin';
const ADMIN_EMAIL = 'admin@shopease.com';
const ADMIN_PASSWORD = 'Admin@1234';
// ──────────────────────────────────────────────────────────────────────────────

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB:', mongoose.connection.host);

        const db = mongoose.connection.db;
        const usersCol = db.collection('users');

        // Check if admin already exists
        const existing = await usersCol.findOne({ email: ADMIN_EMAIL });
        if (existing) {
            console.log(`⚠️  Admin already exists with email: ${ADMIN_EMAIL}`);
            console.log(`   Role: ${existing.role}`);
            // If exists but not admin, upgrade it
            if (existing.role !== 'admin') {
                await usersCol.updateOne({ email: ADMIN_EMAIL }, { $set: { role: 'admin' } });
                console.log('✅ Role upgraded to admin!');
            }
            await mongoose.disconnect();
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

        // Insert admin user
        await usersCol.insertOne({
            name: ADMIN_NAME,
            email: ADMIN_EMAIL,
            password: hashedPassword,
            role: 'admin',
            avatar: '',
            phone: '',
            addresses: [],
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        });

        console.log('\n🎉 Admin user created successfully!');
        console.log('────────────────────────────────');
        console.log(`📧 Email    : ${ADMIN_EMAIL}`);
        console.log(`🔑 Password : ${ADMIN_PASSWORD}`);
        console.log(`👤 Role     : admin`);
        console.log('────────────────────────────────');
        console.log('Use these credentials to login in the app.');

        await mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

createAdmin();
