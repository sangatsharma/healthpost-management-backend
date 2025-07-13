import { customErrors } from "@app/utils/index.utils";
import {
  Request,
  Response,
  NextFunction,
} from "express";
import * as jwt from "jsonwebtoken";
import {
  responseMessageNepali,
  responseMessageEnglish,
  allowedRolesByAccountType,
} from "@app/constants/index.constant";
import { UserJwt } from "@app/types/index.type";
import { UserRegisterType } from "@app/src/validations/index.validation";
import { RepoManager } from "../repository/index.repository";

const registerAuthGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookie = req.cookies;
  const body = req.body as UserRegisterType;

  const { accessToken, refreshToken, locale } = cookie;

  const response = locale === "np"
    ? responseMessageNepali
    : responseMessageEnglish;

  if (body.accountType === "ADMIN")
    throw new customErrors.BadRequestError({
      message: "Cannot create superadmin"
    });

  if (!accessToken || !refreshToken) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: response.AUTH_GUARD.LOGIN
    });
  }

  const user = jwt.verify(accessToken, "secret") as UserJwt;

  if (body.role === "ADMIN" && user.role !== "SUPERADMIN")
    throw new customErrors.AccessError({
      name: "FORBIDDEN",
      message: response.REGISTER.FAIL.PERMISSION,
    });
  else if (body.accountType === "HP" && !(user.role === "ADMIN" || user.role === "SUPERADMIN"))
    throw new customErrors.AccessError({
      name: "FORBIDDEN",
      message: response.REGISTER.FAIL.PERMISSION,
    });
  else if (!allowedRolesByAccountType[body.accountType]?.includes(body.role)) {
    throw new customErrors.BadRequestError({
      message: response.REGISTER.FAIL.INVALID_ROLE,
    });
  }

  let healthPostId: null | undefined | string;

  if (body.accountType === "HP" && body.role !== "ADMIN") {
    const dbUser = await RepoManager.userRepository.findById(user.id);
    healthPostId = dbUser ? dbUser.healthPostId : undefined;
  }
  res.locals.user = {
    ...user,
    healthPostId: healthPostId
  };

  return next();
};

export default registerAuthGuard;
