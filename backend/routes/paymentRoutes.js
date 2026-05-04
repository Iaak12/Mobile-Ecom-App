const express = require('express');
const router = express.Router();
const { getPaymentMethods, updatePaymentMethod, togglePaymentMethod, deletePaymentMethod } = require('../controllers/paymentController');
const { protect, isAdmin } = require('../middlewares/auth');

router.route('/methods')
    .get(getPaymentMethods)
    .post(protect, isAdmin, updatePaymentMethod);

router.route('/methods/:id/toggle')
    .put(protect, isAdmin, togglePaymentMethod);

router.route('/methods/:id')
    .delete(protect, isAdmin, deletePaymentMethod);

module.exports = router;
