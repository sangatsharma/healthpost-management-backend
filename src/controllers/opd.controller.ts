import {
  Request,
  Response,
  NextFunction,
} from "express";
import { OpdVisitType } from "../validations/opd.validation";
import { RepoManager } from "../repository/index.repository";
import customErrors from "@app/utils/customErrors.utils";
import { UserJwt } from "@app/types/index.type";
import { successResponse } from "@app/utils/response.utils";

export const createNewOpd = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user as UserJwt;
  const body = req.body as OpdVisitType;

  const patientExists = await RepoManager.patientRepository.findById(body.patientId);
  if (!patientExists)
    throw new customErrors.NotFoundError({
      message: "Patient not found"
    });

  const examinerExists = await RepoManager.userRepository.findById(body.examinerId);
  if (!examinerExists)
    throw new customErrors.NotFoundError({
      message: "Examiner not found"
    });

  const healthPostExists = await RepoManager.healthPostRepository.findById(body.healthPostId);
  if (!healthPostExists)
    throw new customErrors.NotFoundError({
      message: "Healthpost not found"
    });

  const newOpd = await RepoManager.opdVisitRepository.create(body);

  return successResponse({
    res,
    message: "Success",
    data: newOpd
  });

};
