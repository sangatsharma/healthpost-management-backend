import express from "express";
import {
  otpSchemaValidation,
  userLoginSchemaValidation,
  userRegisterSchemaValidation,
} from "@app/src/validations/index.validation";
import {
  userLoginController,
  userRegisterController,
  valiadteOtpController,
  userLogoutHandler,
  refreshAccessToken,
  adminLoginController
} from "@app/src/controllers/index.controller";

import {
  authGuard,
  languageMiddleware,
  registerAuthGuard,
  uploadToCloudinary
} from "@app/src/helpers/index.helper";
import {
  validateSchema,
  upload,
} from "@app/utils/index.utils";

const authRouter = express.Router();

authRouter.post(
  "/superadmin",
  languageMiddleware,
  adminLoginController,
);
authRouter.post(
  "/register",
  upload.array("profileImage"), // Parse multipart formdata
  validateSchema(userRegisterSchemaValidation),
  // registerAuthGuard,
  uploadToCloudinary,
  languageMiddleware,
  userRegisterController,
);

authRouter.post(
  "/login",
  validateSchema(userLoginSchemaValidation),
  languageMiddleware,
  userLoginController,
);

authRouter.post(
  "/validate-otp",
  languageMiddleware,
  validateSchema(otpSchemaValidation),
  valiadteOtpController
);

authRouter.get(
  "/logout",
  languageMiddleware,
  authGuard(),
  userLogoutHandler
);

authRouter.get(
  "/refresh-token",
  languageMiddleware,
  refreshAccessToken
);

export default authRouter;
