import {
  Request,
  Response,
  NextFunction,
} from "express";
import { NewPatientType } from "@app/src/validations/index.validation";
import { UserJwt } from "@app/types/index.type";
import { RepoManager } from "@app/src/repository/index.repository";
import {
  successResponse,
  customErrors
} from "@app/utils/index.utils";

export const createPatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.body.user as UserJwt;
  const response = res.locals.message;
  const body = req.body as NewPatientType;

  const userExists = await RepoManager.userRepository.findById(body.userId);
  if (!userExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  else if (!userExists.healthPostId)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.HEALTHPOST_ID
    });

  const adminUser = await RepoManager.userRepository.findById(user.id);

  if (!adminUser?.healthPostId || userExists.healthPostId !== adminUser?.healthPostId)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.HEALTHPOST_ID
    });
  const patientData = await RepoManager.patientRepository.create({
    ...body,
    healthPostId: adminUser.healthPostId,
  });

  return successResponse({
    res,
    message: response.PATIENT.CREATE.SUCCESS,
    data: patientData
  });
};


export const getPatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as UserJwt;
  const response = res.locals.message;

  const userExists = await RepoManager.userRepository.findById(user.id);
  if (!userExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  // TODO: healthPostId
  const id = "123";

  const patientData = await RepoManager.patientRepository.getById(user.id, id);
  if (!patientData)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  return successResponse({
    res,
    message: response.COMMON.SUCCESS,
    data: patientData
  });
};

// export const updatePatientHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const id = req.params.id as string;
//   const response = res.locals.message;
//   const body = req.body as UpdatePatientType;
//
//   const patientData = await RepoManager.patientRepository.(user.id);
//   if (!patientData)
//     throw new customErrors.NotFoundError({
//       message: response.COMMON.NOT_FOUND
//     });
//
//   return successResponse({
//     res,
//     message: response.COMMON.SUCCESS,
//     data: patientData
//   });
// };

export const deletePatientRecordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id as string;
  const response = res.locals.message;

  const patientData = await RepoManager.patientRepository.findById(id);
  if (!patientData)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  await RepoManager.patientRepository.delete(id);

  return successResponse({
    res,
    message: response.COMMON.SUCCESS,
    data: patientData
  });
};
