const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, isAdmin } = require('../middlewares/auth');

router.get('/stats', protect, isAdmin, getDashboardStats);
router.route('/users').get(protect, isAdmin, getAllUsers);
router.route('/users/:id').put(protect, isAdmin, updateUserRole).delete(protect, isAdmin, deleteUser);

module.exports = router;
