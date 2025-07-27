import express from "express";
import authGuard from "../helpers/authGuard.helper";
import { validateSchema } from "@app/utils/validateSchema.utils";
import {
  createReferralController,
  getReferralByOpdIdController,
  getReferralsForHealthPostController,
  updateReferralStatusController,
} from "../controllers/opdReferral.controller";
import { acceptRejectReferralSchemaValidation, createOpdReferralSchemaValidation } from "../validations/opdReferral.validation";


const referralRouter = express.Router();

// Create a new Referral
referralRouter.post(
  "",
  authGuard(["SUPERADMIN", "ADMIN", "ANM", "HEALTH_ASSISTANT"]),
  validateSchema(createOpdReferralSchemaValidation),
  createReferralController
);

// Get Referral by OPD ID
referralRouter.get(
  "/opd/:opdId",
  authGuard(),
  getReferralByOpdIdController
);

// Get Referrals for HealthPost (sent/received)
referralRouter.get(
  "/healthpost/:healthPostId",
  authGuard(),
  getReferralsForHealthPostController
);

// PUT /referrals/action
referralRouter.put(
  "/action",
  authGuard(["SUPERADMIN", "ADMIN", "ANM", "HEALTH_ASSISTANT"]),
  validateSchema(acceptRejectReferralSchemaValidation),
  updateReferralStatusController
);

export default referralRouter;
