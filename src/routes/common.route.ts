import express from "express";
import {
  removeImageHandler,
} from "@app/src/controllers/index.controller";
import { upload } from "@app/utils/cloudinary.utils";
import { uploadToCloudinary } from "../helpers/uploadToCloudinary.helper";
import { uploadImageHandler } from "../controllers/common.controller";

const commonRouter = express.Router();

commonRouter.delete(
  "/:id",
  removeImageHandler
);

commonRouter.post(
  "/u",
  upload.fields([
    { name: "images" },
  ]),
  uploadToCloudinary,
  uploadImageHandler
);

export default commonRouter;
