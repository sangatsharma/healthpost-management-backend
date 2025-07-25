import express from "express";
import authGuard from "../helpers/authGuard.helper";
import { createNewOpd, getById, getByPatientId } from "../controllers/opd.controller";
import { validateSchema } from "@app/utils/validateSchema.utils";
import { createOpdVisitSchema } from "../validations/opd.validation";

const opdRouter = express.Router();

opdRouter.post(
  "",
  authGuard(["SUPERADMIN", "ADMIN", "ANM", "HEALTH_ASSISTANT"]),
  validateSchema(createOpdVisitSchema),
  createNewOpd
);

opdRouter.get(
  "/:id",
  authGuard(),
  getById
);

opdRouter.get(
  "/patient/:id",
  authGuard(),
  getByPatientId
);

export default opdRouter;
