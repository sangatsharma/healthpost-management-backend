import {
  Request,
  Response,
  NextFunction,
} from "express";
import {
  customErrors,
  successResponse,
  prisma
} from "@app/utils/index.utils";
import {
  responseMessageNepali,
} from "@app/constants/index.constant";
import {
  NewHealthPostType,
  UpdateHealthPostType,
} from "@app/src/validations/index.validation";
import { UserJwt } from "@app/types/index.type";
import { RepoManager } from "@app/src/repository/index.repository";
import { HealthPost } from "@prisma/client";

export const addNewHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;
  const body = req.body as NewHealthPostType;

  if (body.adminId) {
    const adminExists = await RepoManager.userRepository.findById(body.adminId);
    if (!adminExists)
      throw new customErrors.NotFoundError({
        message: "Invalid adminId"
      });
  }

  const newHealthPost = await RepoManager.healthPostRepository.create(body);

  return successResponse({
    res,
    message: response.CREATE_HEALTHPOST.SUCCESS,
    data: newHealthPost
  });
};

export const getHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;
  const healthPosts = await RepoManager.healthPostRepository.getAll();

  return successResponse({
    res,
    message: response.FETCH_HEALTHPOST.MANY.SUCCESS,
    data: healthPosts
  });
};

export const getAHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;

  const user = res.locals.user as UserJwt;
  const healthPostId = req.params.id;

  const healthPost = await RepoManager.healthPostRepository.findById(
    healthPostId
  );

  if (!healthPost)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });
  else if (user.role === "ADMIN" && healthPost.adminId !== user.id)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  return successResponse({
    res,
    message: response.FETCH_HEALTHPOST.SINGLE.SUCCESS,
    data: healthPost
  });
};

export const removeHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;
  const healthPostId = req.params.id;

  const healthPostExists = await RepoManager.healthPostRepository.findById(
    healthPostId
  );

  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  const healthPost = await RepoManager.healthPostRepository.delete(
    healthPostId
  ) as HealthPost;

  return successResponse({
    res,
    message: response.REMOVE_HEALTHPOST.SUCCESS,
    data: healthPost
  });
};

export const updateHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;
  const healthPostId = req.params.id;
  const data = req.body as UpdateHealthPostType;

  const healthPostExists = await RepoManager.healthPostRepository.findById(
    healthPostId,
  );
  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  if (data.adminId) {
    const adminExists = await RepoManager.userRepository.findById(
      data.adminId
    );

    if (!adminExists || adminExists.role !== "ADMIN")
      throw new customErrors.BadRequestError({
        message: response.UPDATE_HEALTHPOST.FAIL.INVALID_ADMIN_ID
      });
  }

  const updatedHealthPost = await RepoManager.healthPostRepository.update(
    healthPostId,
    data
  ) as HealthPost;

  return successResponse({
    res,
    message: response.UPDATE_HEALTHPOST.SUCCESS,
    data: updatedHealthPost
  });
};
