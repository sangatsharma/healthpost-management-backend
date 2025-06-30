import { cloudinary } from "@app/utils/cloudinary.utils";
import customErrors from "@app/utils/customErrors.utils";
import { successResponse } from "@app/utils/response.utils";
import {
  Request,
  Response,
  NextFunction,
} from "express";

function extractPublicId(url: string): string | null {
  const match = url.match(/upload\/(?:v\d+\/)?(.+)\.(jpg|png|jpeg|webp)$/);
  return match ? match[1] : null;
}

export const removeImageHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const url = "";
  const publicId = extractPublicId(url);
  if (!publicId)
    throw new customErrors.BadRequestError({
      message: "Invalid image url"
    });
  else {
    await cloudinary.uploader.destroy(publicId);

    return successResponse({
      res,
      message: "Image removed",
    });
  }
};
