import {
  Request,
  Response,
  NextFunction,
} from "express";
import { UserJwt } from "@app/types/index.type";
import {
  customErrors,
  successResponse,
} from "@app/utils/index.utils";
import { RepoManager } from "@app/src/repository/index.repository";
import { UpdateUserAdminType, UpdateUserType } from "@app/src/validations/index.validation";

export const getUserHandler = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {

  const userJwt = res.locals.user as UserJwt;

  const user = await RepoManager.userRepository.findById(userJwt.id);

  if (!user)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  return successResponse({
    res,
    message: "Success",
    data: user
  });
};

export const getAllUsersHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const user = await RepoManager.userRepository.getAllWithHealthpost();

  return successResponse({
    res,
    message: "Success",
    data: user
  });
};

export const getOneUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;
  const user = await RepoManager.userRepository.findById(id);

  if (!user)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  return successResponse({
    res,
    message: "Success",
    data: user
  });
};

export const updateUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;
  const body = req.body as UpdateUserType;

  const user = await RepoManager.userRepository.findById(id);

  if (!user)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  const updatedUser = await RepoManager.userRepository.update(id, body);

  return successResponse({
    res,
    message: "Success",
    data: updatedUser
  });
};

export const updateUserAdminHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;
  const user = res.locals.user as UserJwt;
  const { userId, ...rest } = req.body as UpdateUserAdminType;

  const userExists = await RepoManager.userRepository.findById(userId);
  if (!userExists)
    throw new customErrors.NotFoundError({
      message: "Invalid userId"
    });

  if (userExists.accountType === "HP" && userExists.role !== "ADMIN") {
    const adminUser = await RepoManager.userRepository.findById(user.id);
    if (!adminUser)
      throw new customErrors.NotFoundError({
        message: "Invalid userId"
      });
    else if (adminUser.healthPostId !== userExists.healthPostId)
      throw new customErrors.BadRequestError({
        message: "Not admin"
      });
  }

  const updatedUser = await RepoManager.userRepository.update(userId, rest);

  return successResponse({
    res,
    message: "Success",
    data: updatedUser
  });
};
