import express from "express";

import { validateSchema } from "@app/utils/validateSchema.utils";
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
} from "@app/src/helpers/index.helper";

const authRouter = express.Router();

authRouter.post(
  "/superadmin",
  languageMiddleware,
  adminLoginController,
);
authRouter.post(
  "/register",
  // authGuard(["SUPERADMIN"]),
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
  authGuard(),
  userLogoutHandler
);

authRouter.get(
  "/refresh-token",
  refreshAccessToken
);

export default authRouter;
