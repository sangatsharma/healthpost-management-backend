import {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import {
  Request,
  Response,
  NextFunction,
} from "express";
import { cloudinary } from "@app/utils/index.utils";

export const uploadToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;

    if (!files || files.length === 0) {
      // No files uploaded, proceed to next middleware
      res.locals.urls = [];
      res.locals.publicIds = [];
      return next();
    }


    // Process each file and upload to Cloudinary
    const uploadPromises = files.map((file: Express.Multer.File) => {
      return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto",
            folder: "profilePic",
          },
          (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
            if (err) {
              console.error("Cloudinary upload error:", err);
              return reject(err);
            }
            if (!result) {
              console.error("Cloudinary upload error: Result is undefined");
              return reject(new Error("Cloudinary upload result is undefined"));
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        );
        uploadStream.end(file.buffer);
      });
    });

    // Wait for all uploads to complete
    const results = await Promise.all(uploadPromises);

    // Store URLs and public IDs in res.locals
    res.locals.urls = results.map((result) => result.secure_url);
    res.locals.publicIds = results.map((result) => result.public_id);

    next();

    // Wait for all uploads to complete
    // const results = await Promise.all(uploadPromises);
    //
    // // Store URLs and public IDs in res.locals
    // res.locals.profileUrls = results.map((result) => result.secure_url);
    // res.locals.publicIds = results.map((result) => result.public_id);
    //
    // next();

    // const uploadStream = cloudinary.uploader.upload_stream(
    //   {
    //     resource_type: "auto",
    //     folder: "profilePic",
    //   },
    //   (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
    //     if (err) {
    //       console.error("Cloudinary upload error:", err);
    //       return next(err);
    //     }
    //     if (!result) {
    //       console.error("Cloudinary upload error: Result is undefined");
    //       return next(new Error("Cloudinary upload result is undefined"));
    //     }
    //     res.locals.profileUrl = result.secure_url;
    //     res.locals.publicId = result.public_id;
    //
    //     next();
    //   }
    // );
    // uploadStream.end(file.buffer);
  }
  catch (error) {
    console.error("Error in uploadToCloudinary middleware:", error);
    next(error);
  }
};
