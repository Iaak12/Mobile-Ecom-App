const express = require('express');
const router = express.Router();
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct, addReview } = require('../controllers/productController');
const { protect, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/')
    .get(getProducts)
    .post(protect, isAdmin, upload.array('images', 5), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, isAdmin, upload.array('images', 5), updateProduct)
    .delete(protect, isAdmin, deleteProduct);

router.post('/:id/review', protect, addReview);

module.exports = router;
