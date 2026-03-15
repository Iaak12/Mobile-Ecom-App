const asyncHandler = require('express-async-handler');
const PageContent = require('../models/PageContent');

// @desc    Get home screen content
// @route   GET /api/cms/home
// @access  Public
exports.getHomeContent = asyncHandler(async (req, res) => {
    let content = await PageContent.findOne({ page: 'home' });
    
    if (!content) {
        // Create default content if not exists
        content = await PageContent.create({
            page: 'home',
            banners: [],
            sections: []
        });
    }

    res.status(200).json({
        success: true,
        content
    });
});

// @desc    Update home screen content
// @route   PUT /api/cms/home
// @access  Private/Admin
exports.updateHomeContent = asyncHandler(async (req, res) => {
    const { banners, sections } = req.body;

    let content = await PageContent.findOne({ page: 'home' });

    if (!content) {
        content = new PageContent({ page: 'home' });
    }

    content.banners = banners || content.banners;
    content.sections = sections || content.sections;

    await content.save();

    res.status(200).json({
        success: true,
        message: 'Home content updated successfully',
        content
    });
});
