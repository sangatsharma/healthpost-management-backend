import express from "express";
import { getAllPatientHandler } from "../controllers/patient.controller";
import authGuard from "../helpers/authGuard.helper";
import languageMiddleware from "../helpers/responseLanguage.helper";

const patientRouter = express.Router();

patientRouter.get(
  "",
  authGuard(["SUPERADMIN", "ADMIN"]),
  languageMiddleware,
  getAllPatientHandler
);

export default patientRouter;
