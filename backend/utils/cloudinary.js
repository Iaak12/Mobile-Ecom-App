const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (localFilePath, folder = 'products') => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            folder: folder,
            resource_type: 'auto',
        });

        // Remove file from local storage after successful upload
        fs.unlinkSync(localFilePath);

        return {
            url: response.secure_url,
            public_id: response.public_id,
        };
    } catch (error) {
        // Remove file from local storage if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        console.error('Cloudinary upload error:', error);
        return null;
    }
};

const deleteFromCloudinary = async (public_id) => {
    try {
        if (!public_id) return null;
        await cloudinary.uploader.destroy(public_id);
    } catch (error) {
        console.error('Cloudinary deletion error:', error);
    }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
