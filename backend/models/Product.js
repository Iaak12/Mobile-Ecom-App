const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        avatar: { type: String },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: [true, 'Product name is required'], trim: true },
        description: { type: String, required: [true, 'Description is required'] },
        price: { type: Number, required: [true, 'Price is required'], min: 0 },
        discountPrice: { type: Number, default: 0 },
        category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
        brand: { type: String, default: '' },
        stock: { type: Number, required: true, default: 0, min: 0 },
        images: [{ url: String, public_id: String }],
        ratings: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        reviews: [reviewSchema],
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
        tags: [{ type: String }],
    },
    { timestamps: true }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
