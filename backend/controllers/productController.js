const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc  Get all products with search, filter, pagination
// @route GET /api/products
const getProducts = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    let query = { isActive: true };

    if (req.query.search) {
        query.$text = { $search: req.query.search };
    }
    if (req.query.category) {
        query.category = req.query.category;
    }
    if (req.query.minPrice || req.query.maxPrice) {
        query.price = {};
        if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
        if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }
    if (req.query.brand) {
        query.brand = req.query.brand;
    }
    if (req.query.featured === 'true') {
        query.isFeatured = true;
    }

    let sortOption = { createdAt: -1 };
    if (req.query.sort === 'price_asc') sortOption = { price: 1 };
    else if (req.query.sort === 'price_desc') sortOption = { price: -1 };
    else if (req.query.sort === 'rating') sortOption = { ratings: -1 };
    else if (req.query.sort === 'newest') sortOption = { createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .select('-reviews');

    res.json({
        success: true,
        page,
        pages: Math.ceil(total / limit),
        total,
        products,
    });
});

// @desc  Get single product
// @route GET /api/products/:id
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('reviews.user', 'name avatar');
    if (!product || !product.isActive) {
        res.status(404);
        throw new Error('Product not found');
    }
    res.json({ success: true, product });
});

// @desc  Create product (Admin)
// @route POST /api/products
const { uploadToCloudinary } = require('../utils/cloudinary');

const createProduct = asyncHandler(async (req, res) => {
    let images = [];

    // Handle Image Uploads
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await uploadToCloudinary(file.path, 'products');
            if (result) {
                images.push(result);
            }
        }
    }

    // Replace or Add Images to req.body
    req.body.images = images;
    
    // Ensure numeric fields are correctly parsed (multer might send them as strings)
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.discountPrice) req.body.discountPrice = Number(req.body.discountPrice);
    if (req.body.stock) req.body.stock = Number(req.body.stock);
    if (req.body.isFeatured) req.body.isFeatured = req.body.isFeatured === 'true';

    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
});

// @desc  Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = asyncHandler(async (req, res) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    let images = product.images || [];

    // Handle New Image Uploads
    if (req.files && req.files.length > 0) {
        // If we want to replace all images, we could clear the array
        // but often appending or keeping track of deleted ones is better.
        // For simplicity if "replaceImages" flag is sent, we clear.
        if (req.body.replaceImages === 'true') {
            images = [];
        }

        for (const file of req.files) {
            const result = await uploadToCloudinary(file.path, 'products');
            if (result) {
                images.push(result);
            }
        }
    }

    // Handle existing images deletion if client sends an array of public_ids to remove
    if (req.body.deletedImages) {
        const toDelete = Array.isArray(req.body.deletedImages) ? req.body.deletedImages : [req.body.deletedImages];
        images = images.filter(img => !toDelete.includes(img.public_id));
        // Note: Realistically we should also call deleteFromCloudinary(public_id) here
    }

    req.body.images = images;

    // Ensure numeric fields are correctly parsed
    if (req.body.price) req.body.price = Number(req.body.price);
    if (req.body.discountPrice) req.body.discountPrice = Number(req.body.discountPrice);
    if (req.body.stock) req.body.stock = Number(req.body.stock);
    if (req.body.isFeatured) req.body.isFeatured = req.body.isFeatured === 'true';

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, product });
});

// @desc  Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    await Product.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true, message: 'Product removed' });
});

// @desc  Add / Update review
// @route POST /api/products/:id/review
const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }
    const alreadyReviewed = product.reviews.find((r) => r.user.toString() === req.user._id.toString());
    if (alreadyReviewed) {
        alreadyReviewed.rating = rating;
        alreadyReviewed.comment = comment;
    } else {
        product.reviews.push({ user: req.user._id, name: req.user.name, avatar: req.user.avatar, rating, comment });
        product.numReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ success: true, message: 'Review submitted' });
});

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview };
