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
  UpdateHealthPostType,
} from "@app/src/validations/index.validation";
import { UserJwt } from "@app/types/jwtUser.type";

export const addNewHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const response = responseMessageNepali;
  const body = req.body;

  // TODO: Validate adminId
  const newHealthPost = await prisma.healthPost.create({
    data: body
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
  const response = responseMessageNepali;
  const healthPosts = await prisma.healthPost.findMany();

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

  const healthPost = await prisma.healthPost.findFirst({
    where: {
      id: healthPostId as string
    }
  });

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

  const healthPostExists = await prisma.healthPost.findUnique({
    where: {
      id: healthPostId
    }
  });
  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  const healthPost = await prisma.healthPost.delete({
    where: {
      id: healthPostId as string
    }
  });

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

  const healthPostExists = await prisma.healthPost.findUnique({
    where: {
      id: healthPostId
    }
  });

  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  if (data.adminId) {
    const adminExists = await prisma.user.findUnique({
      where: {
        id: data.adminId
      }
    });
    if (!adminExists || adminExists.role !== "ADMIN")
      throw new customErrors.BadRequestError({
        message: response.UPDATE_HEALTHPOST.FAIL.INVALID_ADMIN_ID
      });
  }

  const updatedHealthPost = await prisma.healthPost.update({
    where: {
      id: healthPostId
    },
    data: data
  });

  return successResponse({
    res,
    message: response.UPDATE_HEALTHPOST.SUCCESS,
    data: updatedHealthPost
  });
};
