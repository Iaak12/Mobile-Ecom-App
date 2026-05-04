const express = require('express');
const router = express.Router();
const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { protect, isAdmin } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.route('/')
    .get(getCategories)
    .post(protect, isAdmin, upload.single('image'), createCategory);

router.route('/:id')
    .put(protect, isAdmin, upload.single('image'), updateCategory)
    .delete(protect, isAdmin, deleteCategory);

module.exports = router;
