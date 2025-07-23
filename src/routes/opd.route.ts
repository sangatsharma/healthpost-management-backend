import express from "express";
import authGuard from "../helpers/authGuard.helper";
import { createNewOpd } from "../controllers/opd.controller";
import { validateSchema } from "@app/utils/validateSchema.utils";
import { createOpdVisitSchema } from "../validations/opd.validation";

const opdRouter = express.Router();

opdRouter.post(
  "",
  authGuard(["SUPERADMIN", "ADMIN"]),
  validateSchema(createOpdVisitSchema),
  createNewOpd
);

export default opdRouter;
