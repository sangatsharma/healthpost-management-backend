import express from "express";
import {
  getAllUsersHandler,
  getOneUserHandler,
  getUserHandler,
  updateUserHandler,
  deleteUserHandler
} from "@app/src/controllers/index.controller";
import {
  authGuard,
  uploadToCloudinary,
} from "@app/src/helpers/index.helper";
import { upload, validateSchema } from "@app/utils/index.utils";
import {
  updateUserValidation,
} from "@app/src/validations/index.validation";

const userRouter = express.Router();

userRouter.get("", authGuard(), getUserHandler);
userRouter.get(
  "/all",
  authGuard(["SUPERADMIN"]),
  getAllUsersHandler
);
userRouter.get(
  "/:id",
  authGuard(),
  getOneUserHandler
);

// Update by patient
userRouter.put(
  "/:id",
  authGuard(),
  upload.array("profileImage"), // Parse multipart formdata
  validateSchema(updateUserValidation),
  uploadToCloudinary,
  updateUserHandler
);

userRouter.delete(
  "/:id",
  authGuard(["SUPERADMIN", "ADMIN"]),
  deleteUserHandler
);

export default userRouter;
