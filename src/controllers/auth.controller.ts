import { Request, Response, NextFunction, CookieOptions } from "express";
import * as jwt from "jsonwebtoken";
import { UserJwt } from "@app/types/jwtUser.type";
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
  allowedRolesByAccountType,
  responseMessageEnglish,
  responseMessageNepali,
} from "@app/constants/index.constant";
import {
  jwtTokenGen,
  generateOTP
} from "@app/src/helpers/index.helper";

const domain = CONFIG.ENV === "PROD" ? ".healthsync.me" : "localhost";

const cookieOptions: CookieOptions = {
  secure: CONFIG.ENV === "PROD",
  sameSite: "none",
  httpOnly: true,
  domain: domain,
  path: "/",
  // domain: domain,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// TODO: Code to email

export const adminLoginController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {

  const body = req.body as {
    email: string;
    password: string
  };

  if (body.password !== "secret123")
    throw new customErrors.AccessError({
      name: "FORBIDDEN",
      message: "Access denied"
    });

  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });

  if (!user || user.role !== "SUPERADMIN")
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  const {
    jwtAccessToken,
    jwtRefreshToken,
  } = await jwtTokenGen(user);

  res.cookie("accessToken", jwtAccessToken, cookieOptions);
  res.cookie("refreshToken", jwtRefreshToken, cookieOptions);

  return successResponse({
    res,
    message: "Login Successfull",
    data: user
  });
};

export const userRegisterController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as UserRegisterType;
  const user = res.locals.user as UserJwt;

  // TODO: Better role based access
  if (body.role === "ADMIN" && user.role !== "SUPERADMIN")
    throw new customErrors.AccessError({
      name: "FORBIDDEN",
      message: "Only superadmin can create admin",
    });

  if (!allowedRolesByAccountType[body.accountType]?.includes(body.role)) {
    throw new customErrors.BadRequestError({
      message: `Role '${body.role}' is not allowed for account type '${body.accountType}'`,
    });
  }
  // else if (body.accountType === "HP") {
  //   if (body)
  //   }

  const newUser = await prisma.user.create({
    data: {
      ...body,
      permission: JSON.stringify(body.permission),
    }
  });

  const parsedPermission = JSON.parse(newUser.permission as string);
  const { firstName, middleName, lastName, ...rest } = newUser;

  return successResponse({
    res,
    message: responseMessageEnglish.REGISTER.SUCCESS,
    data: {
      ...rest,
      fullName: {
        firstName,
        middleName,
        lastName
      },
      permission: parsedPermission
    }
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
  else if (newUser.accountType !== body.accountType)
    throw new customErrors.BadRequestError({
      message: `Login from ${newUser.accountType} portal`
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

  // TODO: Uncomment
  // try {
  //   await sendMail({
  //     to: newUser.email,
  //     subject: "OTP for health app",
  //     text: `Your One Time Password for health app is ${otp}`
  //   });
  // }
  // catch {
  //   throw new customErrors.GeneralError({
  //     name: "OTP failed",
  //     message: response.PRE_LOGIN.FAIL.UNKNOWN
  //   });
  // }

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
  // NOTE: REMOVE THIS ONE
  else if (body.otp !== "123456")
    throw new customErrors.GeneralError({
      name: "OTP error",
      message: response.LOGIN.FAIL.INVALID_OTP
    });

  // NOTE: UNCOMMENT LATER: SKIPPED OTP CHECK
  // else if (!user.otp || !user.optCreatedAt || user.otp !== body.otp)
  //   throw new customErrors.GeneralError({
  //     name: "OTP error",
  //     message: response.LOGIN.FAIL.INVALID_OTP
  //   });
  //
  // // Check if OTP was generated within last 5 min
  // const oldOtpCreated = user.optCreatedAt;
  // const now = new Date();
  // const otpDate = new Date(oldOtpCreated);
  // const diff = now.getTime() - otpDate.getTime();
  //
  // if ((diff / 1000) > 300)
  //   throw new customErrors.GeneralError({
  //     name: "OTP error",
  //     message: response.LOGIN.FAIL.EXPIRED_OTP
  //   });

  // Gen tokens
  const { jwtAccessToken, jwtRefreshToken } = await jwtTokenGen(user);

  res.cookie("accessToken", jwtAccessToken, cookieOptions);
  res.cookie("refreshToken", jwtRefreshToken, cookieOptions);

  const { otp, optCreatedAt, firstName, middleName, lastName, ...rest } = user;
  if (rest.permission) {
    rest.permission = JSON.parse(rest.permission as string);
  }

  return successResponse({
    res,
    message: response.LOGIN.SUCCESS,
    data: {
      token: {
        accessToken: jwtAccessToken,
        refreshToken: jwtRefreshToken
      },
      user: {
        ...rest,
        fullName: {
          firstName,
          middleName,
          lastName
        }
      }
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
      refreshToken: null,
      otp: null,
      optCreatedAt: null,
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

  let jsonPermission = user.permission as string[] | null;
  if (jsonPermission)
    jsonPermission = JSON.parse(user.permission as string);

  // Gen tokens
  const jwtAccessPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permission: jsonPermission,
    acountType: user.accountType,
  };

  const jwtAccessToken = jwt.sign(jwtAccessPayload, CONFIG.ACCESS_SECRET, {
    expiresIn: "15m"
  });

  res.cookie("accessToken", jwtAccessToken, cookieOptions);

  if (user.permission) {
    user.permission = JSON.parse(user.permission as string);
  }

  const { otp, optCreatedAt, firstName, middleName, lastName, ...rest } = user;
  return successResponse({
    res,
    message: response.REGEN_ACCESS.SUCCESS,
    data: {
      token: {
        accessToken: jwtAccessToken,
        refreshToken
      },
      user: {
        ...rest,
        fullName: {
          firstName,
          middleName,
          lastName
        }
      }
    }
  });
};
