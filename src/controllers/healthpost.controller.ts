import {
  Request,
  Response,
  NextFunction,
} from "express";
import {
  customErrors,
  successResponse,
} from "@app/utils/index.utils";
import {
  AssignUserToHealthPostType,
  NewHealthPostType,
  UpdateHealthPostType,
} from "@app/src/validations/index.validation";
import { UserJwt } from "@app/types/index.type";
import { RepoManager } from "@app/src/repository/index.repository";
import { HealthPost } from "@prisma/client";


/*
 * #CRUD
*/
export const addNewHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = res.locals.message;
  const body = req.body as NewHealthPostType;

  if (body.adminId) {
    const adminExists = await RepoManager.userRepository.findById(body.adminId);
    if (!adminExists || adminExists?.role !== "ADMIN")
      throw new customErrors.NotFoundError({
        message: "Invalid adminId"
      });
  }

  const newHealthPost = await RepoManager.healthPostRepository.create(body);
  if (body.adminId)
    await RepoManager.userRepository.update(body.adminId, {
      healthPostId: newHealthPost.id
    });

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
  const response = res.locals.message;
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
  const response = res.locals.message;

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
  const response = res.locals.message;
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
  const response = res.locals.message;
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
  if (data.adminId)
    await RepoManager.userRepository.update(data.adminId, {
      healthPostId: healthPostId
    });

  return successResponse({
    res,
    message: response.UPDATE_HEALTHPOST.SUCCESS,
    data: updatedHealthPost
  });
};



/*
 * #OPERATION
*/

export const assignUserToHealthPost = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = res.locals.message;
  const user = res.locals.user as UserJwt;
  const healthPostId = req.params.id;
  const body = req.body as AssignUserToHealthPostType;

  const healthPostExists = await RepoManager.healthPostRepository.findById(healthPostId);
  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: "HealthPost not found"
    });
  else if (healthPostExists.adminId !== user.id)
    throw new customErrors.AccessError({
      name: "FORBIDDEN",
      message: "You dont' own this"
    });

  const userExists = await RepoManager.userRepository.findById(body.userId);
  if (!userExists)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });


  const assignedUser = await RepoManager.userRepository.assignUser({
    userId: body.userId,
    healthPostId
  });
  return successResponse({
    res,
    message: "Successfully assigned user to heallthpost",
    data: assignedUser
  });
};
