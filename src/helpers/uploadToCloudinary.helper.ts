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
    const file = req.file;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "profilePic",
      },
      (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (err) {
          console.error("Cloudinary upload error:", err);
          return next(err);
        }
        if (!result) {
          console.error("Cloudinary upload error: Result is undefined");
          return next(new Error("Cloudinary upload result is undefined"));
        }
        res.locals.profileUrl = result.secure_url;
        res.locals.publicId = result.public_id;

        next();
      }
    );
    uploadStream.end(file?.buffer);
  }
  catch (error) {
    console.error("Error in uploadToCloudinary middleware:", error);
    next(error);
  }
};
