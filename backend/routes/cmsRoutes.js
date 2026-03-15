const express = require('express');
const router = express.Router();
const { getHomeContent, updateHomeContent } = require('../controllers/cmsController');
const { protect, isAdmin } = require('../middlewares/auth');

router.route('/home').get(getHomeContent).put(protect, isAdmin, updateHomeContent);

module.exports = router;
