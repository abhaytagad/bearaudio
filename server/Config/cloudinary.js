const cloudinary = require("cloudinary").v2;

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_secret: process.env.API_SECRET,
      api_key: process.env.API_KEY,
    });
    console.log("cloudinary connected");
  } catch (e) {
    console.log(e);
    console.log("cloudinary could not connect");
  }
};
