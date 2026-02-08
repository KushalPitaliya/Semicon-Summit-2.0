const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadImage = async (filePath, folder = 'gallery') => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: `semiconductor_summit/${folder}`,
            resource_type: 'image',
            transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' }
            ]
        });
        return {
            publicId: result.public_id,
            url: result.secure_url,
            width: result.width,
            height: result.height,
            format: result.format,
            bytes: result.bytes
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
};

// Delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};

// Upload multiple images
const uploadMultiple = async (files, folder = 'gallery') => {
    const results = [];
    for (const file of files) {
        const result = await uploadImage(file.path, folder);
        results.push({
            ...result,
            originalName: file.originalname
        });
    }
    return results;
};

// Get optimized URL with transformations
const getOptimizedUrl = (publicId, options = {}) => {
    const { width, height, quality = 'auto:good' } = options;

    const transformations = [{ quality }];
    if (width) transformations.push({ width, crop: 'scale' });
    if (height) transformations.push({ height, crop: 'scale' });
    transformations.push({ fetch_format: 'auto' });

    return cloudinary.url(publicId, { transformation: transformations });
};

// Get thumbnail URL
const getThumbnailUrl = (publicId) => {
    return cloudinary.url(publicId, {
        transformation: [
            { width: 300, height: 200, crop: 'fill' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' }
        ]
    });
};

module.exports = {
    cloudinary,
    uploadImage,
    deleteImage,
    uploadMultiple,
    getOptimizedUrl,
    getThumbnailUrl
};
