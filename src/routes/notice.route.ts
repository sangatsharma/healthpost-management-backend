import express from "express";
import authGuard from "../helpers/authGuard.helper";
import { validateSchema } from "@app/utils/validateSchema.utils";
import {
  createNoticeController,
  getNoticesForHealthPostController,
  getNoticesForPatientController,
  getNoticeByIdController,
  getAllNoticesController,
} from "../controllers/notice.controller";
import { noticeSchemaValidation } from "../validations/notice.validation";

const noticeRouter = express.Router();

// Create a new Notice
noticeRouter.post(
  "",
  authGuard(["SUPERADMIN", "ADMIN"]),
  validateSchema(noticeSchemaValidation),
  createNoticeController
);

// Get Notices for a Health Post
noticeRouter.get(
  "/healthpost/:healthPostId",
  authGuard(["SUPERADMIN", "ADMIN"]),
  getNoticesForHealthPostController
);

// Get Notices for a Patient
noticeRouter.get(
  "/patient/:patientId",
  authGuard(["SUPERADMIN", "ADMIN", "PATIENT"]),
  getNoticesForPatientController
);

// Get Notice by ID
noticeRouter.get(
  "/:id",
  authGuard(["SUPERADMIN", "ADMIN", "PATIENT"]),
  getNoticeByIdController
);

// Get All Notices (Superadmin only)
noticeRouter.get(
  "",
  authGuard(["SUPERADMIN"]),
  getAllNoticesController
);

export default noticeRouter;
