import { UserJwt } from "@app/types/jwtUser.type";
import customErrors from "@app/utils/customErrors.utils";
import prisma from "@app/utils/db.utils";
import { successResponse } from "@app/utils/response.utils";
import {
  Request,
  Response,
  NextFunction,
} from "express";

export const getUserHandler = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {

  const user = res.locals.user as UserJwt;

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    }
  });

  if (!dbUser)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  const { otp, optCreatedAt, firstName, middleName, lastName, ...rest } = dbUser;
  if (rest.permission) {
    rest.permission = JSON.parse(rest.permission as string);
  }
  return successResponse({
    res,
    message: "Success",
    data: {
      ...rest,
      fullName: {
        firstName,
        middleName,
        lastName
      }
    }
  });
};
