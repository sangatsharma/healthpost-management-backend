import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import {
  CONFIG,
  customErrors,
  prisma,
  successResponse,
} from "@app/utils/index.utils";
import {
  UserLoginType,
  UserRegisterType,
  OtpValidateType
} from "@app/src/validations/index.validation";
import {
  responseMessageEnglish,
  responseMessageNepali,
} from "@app/constants/responseMessage.constant";
import { UserJwt } from "@app/types/jwtUser.type";
import sendMail from "../helpers/sendMain.helper";
import generateOTP from "../helpers/generateOtp.utils";

// TODO: Code to email

export const userRegisterController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as UserRegisterType;

  const newUser = await prisma.user.create({
    data: body
  });

  return successResponse({
    res,
    message: responseMessageEnglish.REGISTER.SUCCESS,
    data: newUser
  });

};

export const userLoginController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;

  if (req.cookies["accessToken"])
    throw new customErrors.BadRequestError({
      message: response.LOGIN.FAIL.ALREADY_LOGGED_IN
    });

  const body = req.body as UserLoginType;

  const newUser = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });

  if (!newUser)
    throw new customErrors.NotFoundError({
      message: response.LOGIN.FAIL.INVALID_EMAIL
    });

  // Check if OTP was generated within last 2 min
  const oldOtpCreated = newUser.optCreatedAt;
  if (oldOtpCreated) {
    const now = new Date();
    const otpDate = new Date(oldOtpCreated);
    const diff = now.getTime() - otpDate.getTime();

    if ((diff / 1000) < 120)
      throw new customErrors.GeneralError({
        name: "OTP error",
        message: response.PRE_LOGIN.FAIL.TOO_FAST
      });
  }

  // Gen new OTP and mail
  const otp = generateOTP();
  const optCreatedAt = new Date();

  try {
    await sendMail({
      to: newUser.email,
      subject: "OTP for health app",
      text: `Your One Time Password for health app is ${otp}`
    });
  }
  catch {
    throw new customErrors.GeneralError({
      name: "OTP failed",
      message: response.PRE_LOGIN.FAIL.UNKNOWN
    });
  }

  await prisma.user.update({
    where: {
      id: newUser.id
    },
    data: {
      otp,
      optCreatedAt
    }
  });

  return successResponse({
    res,
    message: response.PRE_LOGIN.SUCCESS,
  });
};

export const valiadteOtpController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;

  const body = req.body as OtpValidateType;

  if (req.cookies["accessToken"])
    throw new customErrors.BadRequestError({
      message: response.LOGIN.FAIL.ALREADY_LOGGED_IN
    });

  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });

  if (!user)
    throw new customErrors.NotFoundError({
      message: response.LOGIN.FAIL.INVALID_EMAIL
    });

  else if (!user.otp || !user.optCreatedAt || user.otp !== body.otp)
    throw new customErrors.GeneralError({
      name: "OTP error",
      message: response.LOGIN.FAIL.INVALID_OTP
    });

  // Check if OTP was generated within last 5 min
  const oldOtpCreated = user.optCreatedAt;
  const now = new Date();
  const otpDate = new Date(oldOtpCreated);
  const diff = now.getTime() - otpDate.getTime();

  if ((diff / 1000) > 300)
    throw new customErrors.GeneralError({
      name: "OTP error",
      message: response.LOGIN.FAIL.EXPIRED_OTP
    });

  // Gen tokens
  const jwtAccessPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permission: user.permission
  };

  const jwtRefreshPayload = {
    id: user.id
  };

  const jwtAccessToken = jwt.sign(jwtAccessPayload, CONFIG.ACCESS_SECRET, {
    expiresIn: "15m"
  });

  const jwtRefreshToken = jwt.sign(jwtRefreshPayload, CONFIG.REFRESH_SECRET, {
    expiresIn: "7d"
  });

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      otp: null,
      optCreatedAt: null,
      refreshToken: jwtRefreshToken
    }
  });

  res.cookie("accessToken", jwtAccessToken);
  res.cookie("refreshToken", jwtRefreshToken);

  return successResponse({
    res,
    message: response.LOGIN.SUCCESS,
    data: {
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken
    }
  });
};

export const userLogoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as UserJwt;
  const response = responseMessageNepali;

  res.clearCookie("accessToken", {
    expires: new Date("1990-10-10")
  });

  res.clearCookie("refreshToken", {
    expires: new Date("1990-10-10")
  });

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      refreshToken: null
    }
  });

  return successResponse({
    res,
    message: response.LOGOUT.SUCCESS,
  });
};

export const refreshAccessToken = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;
  const refreshToken = req.cookies["refreshToken"] as string;
  const accessToken = req.cookies["accessToken"] as string;

  if (!accessToken || !refreshToken) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Login first"
    });
  }
  jwt.verify(refreshToken, CONFIG.REFRESH_SECRET);

  const user = await prisma.user.findFirst({
    where: {
      refreshToken: refreshToken
    }
  });

  if (!user)
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Login first"
    });

  // Gen tokens
  const jwtAccessPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permission: user.permission
  };

  const jwtAccessToken = jwt.sign(jwtAccessPayload, CONFIG.ACCESS_SECRET, {
    expiresIn: "15m"
  });

  res.cookie("accessToken", jwtAccessToken);

  return successResponse({
    res,
    message: response.REGEN_ACCESS.SUCCESS,
    data: {
      accessToken: jwtAccessToken,
      refreshToken
    }
  });
};
