import customErrors from "@app/utils/customErrors.utils";
import { successResponse } from "@app/utils/response.utils";
import { Request, Response, NextFunction } from "express";
import { RepoManager } from "../repository/index.repository";
import { NoticeSchemaType } from "../validations/notice.validation";
import { NoticeType } from "@prisma/client";
import { UserJwt } from "@app/types/jwtUser.type";

export const createNoticeController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as NoticeSchemaType;
  const creator = res.locals.user as UserJwt;

  if (!creator || !creator.id) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "User not authenticated"
    });
  }

  // Validate superadmin for ALL type notices
  if (body.type === NoticeType.ALL && creator.role !== "SUPERADMIN") {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Only superadmin can send notices to ALL"
    });
  }

  // Validate health post admin can only send to their patients
  // if (body.type === NoticeType.PATIENT && creator.role === "ADMIN") {
  //   const healthPost = await RepoManager.healthPostRepository.find(creator.id);
  //   if (!healthPost) {
  //     throw new customErrors.NotFoundError({
  //       message: "Health post not found for this admin"
  //     });
  //   }
  //   if (body.toIds && body.toIds.length > 0) {
  //     const invalidPatients = await RepoManager.patientRepository.findPatientsNotInHealthPost(
  //       body.toIds,
  //       healthPost.id
  //     );
  //     if (invalidPatients.length > 0) {
  //       throw new customErrors.BadRequestError({
  //         message: "Cannot send notices to patients not in your health post"
  //       });
  //     }
  //   }
  // }

  const notice = await RepoManager.noticeRepository.create(body, creator.id);

  return successResponse({
    res,
    message: "Notice Created Successfully",
    data: notice
  });
};

export const getNoticesForHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { healthPostId } = req.params;
  const user = res.locals.user as UserJwt;

  if (!user || !user.id) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "User not authenticated"
    });
  }

  const u = await RepoManager.userRepository.findById(user.id);
  if (!u)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });

  // Validate that admin is accessing their own health post
  if (user.role === "ADMIN") {
    const healthPost = await RepoManager.healthPostRepository.findById(u?.healthPostId as string);
    if (!healthPost || healthPost.id !== healthPostId) {
      throw new customErrors.AccessError({
        name: "UNAUTHORIZED",
        message: "Admin not authorized to access this health post"
      });
    }
  }

  const notices = await RepoManager.noticeRepository.getForHealthPost(healthPostId);

  return successResponse({
    res,
    message: "Notices Fetched Successfully",
    data: notices
  });
};

export const getNoticesForPatientController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { patientId } = req.params;
  const user = res.locals.user as UserJwt;

  if (!user || !user.id) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "User not authenticated"
    });
  }

  const u = await RepoManager.userRepository.findById(user.id);
  if (!u)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });
  // Validate that patient is accessing their own notices or admin is accessing their health post's patients
  if (user.role === "PATIENT" && user.id !== patientId) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Patient can only access their own notices"
    });
  } else if (user.role === "ADMIN") {
    const healthPost = await RepoManager.healthPostRepository.findById(u.healthPostId as string);
    if (!healthPost) {
      throw new customErrors.NotFoundError({
        message: "Health post not found for this admin"
      });
    }
    const patient = await RepoManager.patientRepository.findById(patientId);
    if (!patient || patient.healthPostId !== healthPost.id) {
      throw new customErrors.AccessError({
        name: "UNAUTHORIZED",
        message: "Admin not authorized to access this patient's notices"
      });
    }
  }

  const notices = await RepoManager.noticeRepository.getForPatient(patientId);

  return successResponse({
    res,
    message: "Notices Fetched Successfully",
    data: notices
  });
};

export const getNoticeByIdController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { id } = req.params;
  const user = res.locals.user as UserJwt;

  if (!user || !user.id) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "User not authenticated"
    });
  }

  const notice = await RepoManager.noticeRepository.getById(id);

  if (!notice) {
    throw new customErrors.NotFoundError({
      message: "Notice not found"
    });
  }

  const u = await RepoManager.userRepository.findById(user.id);
  if (!u)
    throw new customErrors.NotFoundError({
      message: "User not found"
    });
  // Validate access based on notice type and user role
  if (user.role !== "SUPERADMIN") {
    if (notice.type === NoticeType.HP && user.role === "ADMIN") {
      const healthPost = await RepoManager.healthPostRepository.findById(u?.healthPostId as string);
      if (!healthPost || !notice.toIds.includes(healthPost.id)) {
        throw new customErrors.AccessError({
          name: "UNAUTHORIZED",
          message: "Admin not authorized to access this notice"
        });
      }
    } else if (notice.type === NoticeType.PATIENT && user.role === "PATIENT") {
      if (!notice.toIds.includes(user.id)) {
        throw new customErrors.AccessError({
          name: "UNAUTHORIZED",
          message: "Patient not authorized to access this notice"
        });
      }
    } else if (notice.type !== NoticeType.ALL) {
      throw new customErrors.AccessError({
        name: "UNAUTHORIZED",
        message: "User not authorized to access this notice"
      });
    }
  }

  return successResponse({
    res,
    message: "Notice Fetched Successfully",
    data: notice
  });
};

export const getAllNoticesController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const user = res.locals.user as UserJwt;

  if (!user || !user.id) {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "User not authenticated"
    });
  }

  if (user.role !== "SUPERADMIN") {
    throw new customErrors.AccessError({
      name: "UNAUTHORIZED",
      message: "Only superadmin can view all notices"
    });
  }

  const notices = await RepoManager.noticeRepository.getAllForSuperadmin();

  return successResponse({
    res,
    message: "All Notices Fetched Successfully",
    data: notices
  });
};
