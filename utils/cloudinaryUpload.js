const cloudinary = require("./cloudinaryConfig");

const cloudinaryUpload = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "Le-Travaille",
    });
    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    throw new Error("Image upload to Cloudinary failed");
  }
};

module.exports = cloudinaryUpload;
