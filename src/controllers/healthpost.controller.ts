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
