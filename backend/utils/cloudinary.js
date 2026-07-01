const cloudinary = require("cloudinary").v2
require("dotenv").config()
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret:process.env.API_SECRET,
})

const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
       folder:"chat_app/profile_pics"
    });

    return result;
  } catch (error) {
    console.log("Cloudinary Error:", error);
    return null;
  }
};


module.exports = {cloudinary,uploadOnCloudinary}