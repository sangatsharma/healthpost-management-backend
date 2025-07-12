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
  const user = res.locals.user as UserJwt;
  const healthPostId = req.params.id;
  const response = res.locals.message;
  const body = req.body as NewPatientType;

  const userExists = await RepoManager.userRepository.findByEmail(body.email);
  if (userExists)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.PATIENT_EXISTS
    });
  const patientExists = await RepoManager.patientRepository.findByEmail(body.email);
  if (patientExists)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.PATIENT_EXISTS
    });

  const healthPostExists = await RepoManager.healthPostRepository.findById(healthPostId);
  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.HP_NOT_FOUND
    });

  if (user.role !== "SUPERADMIN") {
    const adminUser = await RepoManager.userRepository.findById(user.id);

    if (!adminUser?.healthPostId)
      throw new customErrors.NotFoundError({
        message: response.PATIENT.CREATE.ERROR.HEALTHPOST_ID
      });
  }
  const patientData = await RepoManager.patientRepository.create({
    ...body,
    healthPostId: healthPostId,
  });
  const count = patientData.count;
  const code = healthPostExists.name?.slice(0, 3).toUpperCase() + String(body.wardNo) + "-" + String(count);

  const newPatientData = await RepoManager.patientRepository.addCode(patientData.id, code);

  return successResponse({
    res,
    message: response.PATIENT.CREATE.SUCCESS,
    data: newPatientData
  });
};


export const getAPatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as UserJwt;
  const userId = req.params.userId;
  const healthPostId = req.params.id;
  const response = res.locals.message;

  const healthPost = await RepoManager.healthPostRepository.findById(healthPostId);
  if (!healthPost)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  const userExists = await RepoManager.userRepository.findById(userId);
  if (!userExists)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  if (user.role !== "SUPERADMIN") {
    const admin = await RepoManager.userRepository.findById(user.id);

    if (!admin)
      throw new customErrors.NotFoundError({
        message: response.COMMON.NOT_FOUND
      });
    else if (!admin.healthPostId || admin.healthPostId !== healthPostId)
      throw new customErrors.BadRequestError({
        message: "FORBIDDEN"
      });
  }

  const patientInfo = await RepoManager.patientRepository.findById(userId);

  if (!patientInfo)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });
  else if (patientInfo.healthPostId !== healthPostId)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  return successResponse({
    res,
    message: "Success",
    data: patientInfo
  });
};

export const getAllPatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as UserJwt;
  const healthPostId = req.params.id;
  const response = res.locals.message;

  const healthPost = await RepoManager.healthPostRepository.findById(healthPostId);
  if (!healthPost)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  if (user.role !== "SUPERADMIN") {
    const admin = await RepoManager.userRepository.findById(user.id);
    if (!admin)
      throw new customErrors.NotFoundError({
        message: response.COMMON.NOT_FOUND
      });
    else if (!admin.healthPostId || admin.healthPostId !== healthPostId)
      throw new customErrors.BadRequestError({
        message: "FORBIDDEN"
      });
  }

  const patientsData = await RepoManager.patientRepository.getAllMin();

  return successResponse({
    res,
    message: response.COMMON.SUCCESS,
    data: patientsData
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
  const userId = req.params.userId as string;
  const healthPostId = req.params.id as string;
  const user = res.locals.user as UserJwt;
  const response = res.locals.message;

  const healthPost = await RepoManager.healthPostRepository.findById(healthPostId);
  if (!healthPost)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  const patientData = await RepoManager.patientRepository.findById(userId);
  if (!patientData)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  if (user.role !== "SUPERADMIN") {

    const admin = await RepoManager.userRepository.findById(user.id);
    if (!admin)
      throw new customErrors.NotFoundError({
        message: response.COMMON.NOT_FOUND
      });
    else if (!admin.healthPostId || (admin.healthPostId !== healthPostId))
      throw new customErrors.NotFoundError({
        message: response.COMMON.NOT_FOUND
      });
  }

  await RepoManager.patientRepository.delete(userId);

  return successResponse({
    res,
    message: response.COMMON.SUCCESS,
    data: patientData
  });
};
