import customErrors from "@app/utils/customErrors.utils";
import {
  Request,
  Response,
  NextFunction,
} from "express";
import * as jwt from "jsonwebtoken";
import {
  responseMessageNepali,
  responseMessageEnglish,
} from "@app/constants/responseMessage.constant";
import { UserJwt } from "@app/types/jwtUser.type";

const authGuard = (role?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const cookie = req.cookies;
    const { accessToken, refreshToken, locale } = cookie;

    const response = locale === "np"
      ? responseMessageNepali
      : responseMessageEnglish;

    if (!accessToken || !refreshToken) {
      throw new customErrors.AccessError({
        name: "UNAUTHORIZED",
        message: response.AUTH_GUARD.LOGIN
      });
    }

    if (req.path === "/logout") {
      const user = jwt.verify(refreshToken, "12345678") as UserJwt;
      res.locals.user = user;
      return next();
    }

    const user = jwt.verify(accessToken, "secret") as UserJwt;

    if (role) {
      const userRole = user.role;
      const roleMatch = role.some((r) => r === userRole);

      if (!roleMatch)
        throw new customErrors.AccessError({
          name: "FORBIDDEN",
          message: response.AUTH_GUARD.ROLE
        });
    }

    res.locals.user = user;
    next();
  };
};

export default authGuard;
