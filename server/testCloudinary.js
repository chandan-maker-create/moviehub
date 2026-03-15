import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const testImage = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop';

console.log('Testing Cloudinary upload...');
cloudinary.uploader.upload(testImage, { folder: 'moviehub_test' })
  .then(result => {
    console.log('Upload successful!');
    console.log('Secure URL:', result.secure_url);
    process.exit(0);
  })
  .catch(err => {
    console.error('Upload failed:');
    console.error(err);
    process.exit(1);
  });
