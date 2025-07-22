import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { Request, Response, NextFunction } from "express";
import { cloudinary } from "@app/utils/index.utils";

export const uploadToCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const files = req.files as Record<string, Express.Multer.File[]>;

    if (!files || Object.keys(files).length === 0) {
      return next(); // No files uploaded
    }

    res.locals.uploads = {}; // Initialize the dynamic upload result container

    // Optional: Map field name → Cloudinary folder
    const folderMap: Record<string, string> = {
      profileImage: "profilePic",
      signature: "signature",
      images: "images",
      // Add more mappings as needed
    };

    // Upload a single file to Cloudinary
    const uploadFile = async (file: Express.Multer.File, folder: string) => {
      return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder,
          },
          (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (err) return reject(err);
            if (!result) return reject(new Error("Cloudinary upload result is undefined"));
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    };

    // Upload all files per field
    const uploadPromises = Object.entries(files).map(async ([fieldName, fileList]) => {
      if (!fileList || fileList.length === 0) return;

      const folder = folderMap[fieldName] || fieldName;

      const results = await Promise.all(
        fileList.map((file) => uploadFile(file, folder))
      );

      res.locals.uploads[fieldName] = results; // Store array of uploads
    });

    await Promise.all(uploadPromises);

    return next();
  } catch (error) {
    console.error("Error in uploadToCloudinary middleware:", error);
    return next(error);
  }
};
