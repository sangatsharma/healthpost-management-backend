import customErrors from "@app/utils/customErrors.utils";
import { successResponse } from "@app/utils/response.utils";
import { Request, Response, NextFunction } from "express";
import { RepoManager } from "../repository/index.repository";
import { AcceptRejectReferralInput, CreateOpdReferralInput } from "../validations/opdReferral.validation";

export const createReferralController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  // TODO: Validate if exists
  const body = req.body as CreateOpdReferralInput;

  const existingReferral = await RepoManager.opdVisitRepository.getReferralByOpdId(body.opdId);
  if (existingReferral) {
    throw new customErrors.AccessError({
      name: "CONFLICT",
      message: "Referral already exists for this OPD Visit"
    });
  }

  const referral = await RepoManager.opdVisitRepository.createReferral(body);

  return successResponse({
    res,
    message: "Referral Created Successfully",
    data: referral
  });
};

export const getReferralByOpdIdController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { opdId } = req.params;

  const referral = await RepoManager.opdVisitRepository.getReferralByOpdId(opdId);

  if (!referral) {
    throw new customErrors.NotFoundError({
      message: "Referral not found"
    });
  }

  return successResponse({
    res,
    message: "Referral Fetched Successfully",
    data: referral
  });
};

export const getReferralsForHealthPostController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { healthPostId } = req.params;
  const type = req.query.type as "SENT" | "RECEIVED";

  if (type !== "SENT" && type !== "RECEIVED") {
    throw new customErrors.BadRequestError({
      message: "Type must be either SENT or RECEIVED"
    });
  }

  const referrals = await RepoManager.opdVisitRepository.getReferralsForHealthPost(healthPostId, type);

  return successResponse({
    res,
    message: "Referrals Fetched Successfully",
    data: referrals
  });
};

export const updateReferralStatusController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as AcceptRejectReferralInput;

  const referral = await RepoManager.opdVisitRepository.updateReferralStatus(
    body.referralId,
    body.referalStatus
  );

  return successResponse({
    res,
    message: `Referral status updated to ${referral.referralStatus}`,
    data: referral
  });
};
