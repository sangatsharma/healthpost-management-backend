import {
  Request,
  Response,
  NextFunction,
} from "express";
import { UserJwt } from "@app/types/index.type";
import {
  cloudinary,
  customErrors,
  successResponse,
} from "@app/utils/index.utils";
import { RepoManager } from "@app/src/repository/index.repository";
import { UpdateUserType } from "@app/src/validations/index.validation";

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
  const user = res.locals.user as UserJwt;

  // Patent cannot change these fields
  if (user.role === "PATIENT") {
    delete body.permissions;
    delete body.status;
  }

  const profileUrl = res.locals.urls[0] || null;
  const publicId = res.locals.publicIds[0] || null;

  const userExists = await RepoManager.userRepository.findById(id);

  if (!userExists)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  try {

    if (profileUrl && userExists.profileImage[0]) {
      const match = userExists.profileImage[0].match(/upload\/v\d+\/(.+?)\.(jpg|jpeg|png|webp)$/i);
      if (match) {
        await cloudinary.uploader.destroy(match[1]);
      }
      delete body.profileImage;
    }

    const updatedUser = await RepoManager.userRepository.update(id, {
      ...body,
      ...(profileUrl ? { profileImage: profileUrl } : {}),
    });

    return successResponse({
      res,
      message: "Success",
      data: updatedUser
    });

  }
  catch (err) {
    await cloudinary.uploader.destroy(publicId);
    next(err);
  }
};

export const deleteUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;
  const user = res.locals.user as UserJwt;

  const userExists = await RepoManager.userRepository.findById(id);
  if (!userExists)
    throw new customErrors.NotFoundError({
      message: "Invalid userId"
    });

  if (id !== user.id && user.role !== "SUPERADMIN") {
    const requestingUser = await RepoManager.userRepository.findById(id);

    if (requestingUser?.role !== "ADMIN")
      throw new customErrors.AccessError({
        name: "FORBIDDEN",
        message: "Not enough permission"
      });

    else if (requestingUser.healthPostId !== userExists.healthPostId)
      throw new customErrors.AccessError({
        name: "FORBIDDEN",
        message: "Not enough permission"
      });
  }

  await RepoManager.userRepository.deleteUser(id);

  return successResponse({
    res,
    message: "User deleted successfully",
  });
};
