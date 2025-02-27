const cloudinary = require('cloudinary').v2;
require("dotenv").config();
// console.log( process.env.API_key)
//Configuration
cloudinary.config({ 
    cloud_name: process.env.Cloud_name, 
    api_key: process.env.API_key, 
    api_secret: process.env.API_secret // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;