const express = require('express');
const router = express.Router();
const { getPaymentMethods, updatePaymentMethod, togglePaymentMethod } = require('../controllers/paymentController');
const { protect, isAdmin } = require('../middlewares/auth');

router.route('/methods')
    .get(getPaymentMethods)
    .post(protect, isAdmin, updatePaymentMethod);

router.route('/methods/:id/toggle')
    .put(protect, isAdmin, togglePaymentMethod);

module.exports = router;
