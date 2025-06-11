// utils/cloudinaryUpload.js
const cloudinary = require("../config/cloudinary");
const fs = require("fs/promises");

async function uploadToCloudinary(localPath, folder, resourceType = "image") {
  const result = await cloudinary.uploader.upload(localPath, {
    folder,
    resource_type: resourceType,
  });
  await fs.unlink(localPath); 
  return result.secure_url;   
}

module.exports = uploadToCloudinary;
