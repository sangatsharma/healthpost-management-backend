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
  refreshAccessToken
} from "@app/src/controllers/index.controller";

import { authGuard } from "@app/src/helpers/index.helper";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateSchema(userRegisterSchemaValidation),
  userRegisterController,
);

authRouter.post(
  "/login",
  validateSchema(userLoginSchemaValidation),
  userLoginController,
);

authRouter.post(
  "/validate-otp",
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
