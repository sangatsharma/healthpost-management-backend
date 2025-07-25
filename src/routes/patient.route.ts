import express from "express";
import { getAllPatientHandler, getAPatientHandler } from "../controllers/patient.controller";
import authGuard from "../helpers/authGuard.helper";
import languageMiddleware from "../helpers/responseLanguage.helper";

const patientRouter = express.Router();

patientRouter.get(
  "",
  authGuard(["SUPERADMIN", "ADMIN"]),
  languageMiddleware,
  getAllPatientHandler
);

patientRouter.get(
  "/:id",
  authGuard(),
  languageMiddleware,
  getAPatientHandler
);

export default patientRouter;
