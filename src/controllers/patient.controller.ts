import {
  Request,
  Response,
  NextFunction,
} from "express";
import { NewPatientType, UpdatePatientType } from "@app/src/validations/index.validation";
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

  const uploads = res.locals.uploads as Record<
    string,
    { secure_url: string; public_id: string }[] // All fields now have array of uploads
  >;

  const profileImage = uploads?.profileImage?.[0];
  const profileUrl = profileImage?.secure_url || null;
  const profilePublicId = profileImage?.public_id || null;

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
    profileImage: profileUrl
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

export const updatePatientHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as UserJwt;
  const healthPostId = req.params.id;
  const response = res.locals.message;
  const body = req.body as UpdatePatientType;

  const uploads = res.locals.uploads as Record<
    string,
    { secure_url: string; public_id: string }[] // All fields now have array of uploads
  >;

  const profileImage = uploads?.profileImage?.[0];
  const profileUrl = profileImage?.secure_url || null;
  const profilePublicId = profileImage?.public_id || null;

  const patientExists = await RepoManager.patientRepository.findById(body.patientId);
  if (!patientExists)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.PATIENT_EXISTS
    });

  const healthPostExists = await RepoManager.healthPostRepository.findById(healthPostId);
  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: response.PATIENT.CREATE.ERROR.HP_NOT_FOUND
    });
  console.log(body);
  console.log(profileUrl);
  if (user.role !== "SUPERADMIN") {
    const adminUser = await RepoManager.userRepository.findById(user.id);

    if (!adminUser?.healthPostId)
      throw new customErrors.NotFoundError({
        message: response.PATIENT.CREATE.ERROR.HEALTHPOST_ID
      });
  }
  const patientData = await RepoManager.patientRepository.update({
    ...body,
    profileImage: body.profileImage ?? profileUrl
  });

  return successResponse({
    res,
    message: response.PATIENT.CREATE.SUCCESS,
    data: patientData
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
  const response = res.locals.message;

  const patientsData = await RepoManager.patientRepository.getAll();

  return successResponse({
    res,
    message: response.COMMON.SUCCESS,
    data: patientsData
  });
};

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


export const getHealthPostStaffController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const healthPostId = req.params.id as string;
  const user = res.locals.user as UserJwt;
  const response = res.locals.message;

  const healthPost = await RepoManager.healthPostRepository.findById(healthPostId);

  if (!healthPost)
    throw new customErrors.NotFoundError({
      message: response.COMMON.NOT_FOUND
    });

  else if (user.role !== "SUPERADMIN" && healthPost.adminId !== user.id)
    throw new customErrors.NotFoundError({
      message: response.COMMON.FORBIDDEN
    });

  const staffs = await RepoManager.userRepository.getAllStaff(healthPostId);

  return successResponse({
    res,
    message: response.COMMON.SUCCESS,
    data: staffs
  });
};
