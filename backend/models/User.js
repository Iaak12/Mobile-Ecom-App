const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Please enter your name'], trim: true },
        email: {
            type: String,
            required: [true, 'Please enter your email'],
            unique: true,
            lowercase: true,
        },
        password: { type: String, required: [true, 'Please enter a password'], minlength: 6, select: false },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        avatar: { type: String, default: '' },
        phone: { type: String, default: '' },
        addresses: [addressSchema],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
