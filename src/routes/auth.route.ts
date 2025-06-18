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
  authGuard(["SUPERADMIN"]),
  upload.single("profileImage"),
  uploadToCloudinary,
  validateSchema(userRegisterSchemaValidation),
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
