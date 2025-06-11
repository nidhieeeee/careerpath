const cloudinary = require('cloudinary').v2;
const fs = require('fs/promises');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadToCloudinary(localFilePath, folder = '', resourceType = 'image') {
  try {
    const options = { folder };
    if (resourceType === 'raw') {
      options.resource_type = 'raw';
    }

    const result = await cloudinary.uploader.upload(localFilePath, options);
    await fs.unlink(localFilePath); 
    return result.secure_url;
  } catch (error) {
    throw new Error('Cloudinary upload failed: ' + error.message);
  }
}

module.exports = uploadToCloudinary;
