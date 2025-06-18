import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { CONFIG } from "@app/utils/index.utils";


cloudinary.config({
  cloud_name: CONFIG.CLOUDINARY_CLOUD_NAME,
  api_key: CONFIG.CLOUDINARY_API_KEY,
  api_secret: CONFIG.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage(); // In-memory buffer
const upload = multer({ storage });

export {
  upload,
  cloudinary
};
