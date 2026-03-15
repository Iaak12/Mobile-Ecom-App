const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    image: { url: String, public_id: String },
    title: String,
    subtitle: String,
    linkType: { type: String, enum: ['product', 'category', 'external', 'none'], default: 'none' },
    linkId: String, // Product ID or Category ID
    active: { type: Boolean, default: true }
});

const sectionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: String,
    type: { 
        type: String, 
        enum: ['banner_slider', 'category_circles', 'featured_grid', 'product_scroll', 'official_merch_grid'], 
        required: true 
    },
    items: [{
        image: { url: String, public_id: String },
        title: String,
        linkType: { type: String, enum: ['product', 'category', 'external'], default: 'category' },
        linkId: String
    }],
    referenceIds: [{ type: mongoose.Schema.Types.ObjectId }], // For product_scroll or categories
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
});

const pageContentSchema = new mongoose.Schema({
    page: { type: String, default: 'home', unique: true },
    banners: [bannerSchema],
    sections: [sectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('PageContent', pageContentSchema);
