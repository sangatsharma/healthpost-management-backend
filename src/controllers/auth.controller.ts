import {
  Request,
  Response,
  NextFunction,
  CookieOptions,
} from "express";
import * as jwt from "jsonwebtoken";
import { UserJwt } from "@app/types/jwtUser.type";
import {
  cloudinary,
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
  jwtTokenGen,
  generateOTP,
  TokenHelper
} from "@app/src/helpers/index.helper";
import { RepoManager } from "@app/src/repository/index.repository";
import { Patient, User } from "@prisma/client";
import { ModifiedUser } from "@app/types/index.type";

const domain = CONFIG.ENV === "PROD" ? ".healthsync.me" : "localhost";

const cookieOptions: CookieOptions = {
  secure: CONFIG.ENV === "PROD",
  sameSite: "none",
  httpOnly: true,
  // domain: domain,
  path: "/",
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
  next: NextFunction
) => {
  const body = req.body as UserRegisterType;
  // NOTE: For later
  const user = res.locals.user as UserJwt & {
    healthPostId: string | undefined | null
  };

  const response = res.locals.message;
  const uploads = res.locals.uploads as Record<
    string,
    { secure_url: string; public_id: string }[] // All fields now have array of uploads
  >;


  // Extract profile image and signature from multer
  const profileImage = uploads?.profileImage?.[0];
  const signature = uploads?.signature?.[0];

  const profileUrl = profileImage?.secure_url || null;
  const signatureUrl = signature?.secure_url || null;

  const profilePublicId = profileImage?.public_id || null;
  const signaturePublicId = signature?.public_id || null;

  try {
    const newUser = await RepoManager.userRepository.create({
      ...body,
      signature: signatureUrl,
      signaturePublicId: signaturePublicId,
      profileImage: profileUrl,
      profileImagePublicId: profilePublicId,
    });

    return successResponse({
      res,
      message: response.REGISTER.SUCCESS,
      data: newUser
    });

  }
  catch (err) {
    if (profileUrl) {
      await cloudinary.uploader.destroy(profileImage?.public_id);
    }
    if (signatureUrl) {
      await cloudinary.uploader.destroy(signature?.public_id);
    }
    return next(err);
  }
};

export const userLoginController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = res.locals.message;

  if (req.cookies["accessToken"])
    throw new customErrors.BadRequestError({
      message: response.LOGIN.FAIL.ALREADY_LOGGED_IN
    });

  const body = req.body as UserLoginType;

  let existingUser: User | Patient | null;
  if (body.accountType === "PATIENT") {
    existingUser = await RepoManager.patientRepository.findByEmail(body.email) as Patient | null;
  }
  else {
    existingUser = await RepoManager.userRepository.findByEmail(body.email) as User | null;
  }

  if (!existingUser)
    throw new customErrors.NotFoundError({
      message: response.LOGIN.FAIL.INVALID_EMAIL
    });
  // else if (existingUser.accountType !== body.accountType)
  //   throw new customErrors.BadRequestError({
  //     message: `Login from ${existingUser.accountType} portal`
  //   });

  // Check if OTP was generated within last 2 min
  const oldOtpCreated = existingUser.optCreatedAt;
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

  await RepoManager.userRepository.updateOtp(existingUser.id, otp);

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
  const response = res.locals.message;

  const body = req.body as OtpValidateType;

  if (req.cookies["accessToken"])
    throw new customErrors.BadRequestError({
      message: response.LOGIN.FAIL.ALREADY_LOGGED_IN
    });


  let existingUser: ModifiedUser | Patient | null;
  existingUser = await RepoManager.userRepository.findByEmail(body.email, true) as ModifiedUser | null;
  if (!existingUser) {
    const tmpUser = await RepoManager.patientRepository.findByEmail(body.email) as Patient | null;
    if (tmpUser)
      existingUser = {
        ...tmpUser,
        permissions: []
      };
  }

  if (!existingUser)
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
  const {
    accessToken,
    refreshToken
  } = await TokenHelper.genTokens(existingUser);

  // await RepoManager.userRepository.clearOtp(existingUser.id);

  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  return successResponse({
    res,
    message: response.LOGIN.SUCCESS,
    data: {
      token: {
        accessToken,
        refreshToken
      },
      user: existingUser
    }
  });
};

export const userLogoutHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as {
    id: string
  };
  const response = res.locals.message;

  res.clearCookie("accessToken", {
    expires: new Date("1990-10-10")
  });

  res.clearCookie("refreshToken", {
    expires: new Date("1990-10-10")
  });

  await RepoManager.userRepository.updateLogout(user.id);

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
  const response = res.locals.message;
  const refreshToken = req.cookies["refreshToken"] as string;
  const oldAccessToken = req.cookies["accessToken"] as string;

  if (!oldAccessToken || !refreshToken) {
    res.clearCookie("accessToken", {
      expires: new Date("1990-10-10")
    });

    res.clearCookie("refreshToken", {
      expires: new Date("1990-10-10")
    });
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Login first"
    });
  }
  const userRefresh = jwt.verify(refreshToken, CONFIG.REFRESH_SECRET) as {
    id: string
  };

  const user = await RepoManager.userRepository.findById(userRefresh.id);

  if (!user) {
    res.clearCookie("accessToken", {
      expires: new Date("1990-10-10")
    });

    res.clearCookie("refreshToken", {
      expires: new Date("1990-10-10")
    });
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Login first"
    });
  }

  const { accessToken } = TokenHelper.regenRefresh(user);

  res.cookie("accessToken", accessToken, cookieOptions);

  return successResponse({
    res,
    message: response.REGEN_ACCESS.SUCCESS,
    data: {
      token: {
        accessToken: accessToken,
        refreshToken
      },
      user
    }
  });
};
