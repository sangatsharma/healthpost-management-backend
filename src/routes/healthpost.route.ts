import express from "express";

import {
  upload,
  validateSchema,
} from "@app/utils/index.utils";
import {
  assignToHealthPost,
  newHealthPostSchemaValidation,
  newPatientValidation,
  updateHealthPostSchemaValidation,
} from "@app/src/validations/index.validation";
import {
  addNewHealthPostController,
  assignUserToHealthPost,
  getAHealthPostController,
  getHealthPostController,
  removeHealthPostController,
  updateHealthPostController,
} from "@app/src/controllers/index.controller";
import {
  authGuard,
  languageMiddleware,
  uploadToCloudinary,
} from "@app/src/helpers/index.helper";
import {
  createPatientHandler,
  deletePatientRecordHandler,
  getAllPatientHandler,
  getAPatientHandler
} from "../controllers/patient.controller";

const healthPostRouter = express.Router();

// Add new healthpost

/*  DOC
 *  - 
 *
 */
healthPostRouter.post(
  "",
  upload.array("images"),
  authGuard(["SUPERADMIN"]),
  validateSchema(newHealthPostSchemaValidation),
  uploadToCloudinary,
  languageMiddleware,
  addNewHealthPostController
);
healthPostRouter.get(
  "",
  authGuard(["SUPERADMIN"]),
  languageMiddleware,
  getHealthPostController
);
healthPostRouter.get(
  "/:id",
  authGuard(),
  languageMiddleware,
  getAHealthPostController
);
healthPostRouter.delete(
  "/:id",
  authGuard(["SUPERADMIN"]),
  languageMiddleware,
  removeHealthPostController
);
healthPostRouter.put(
  "/:id",
  upload.array("images"),
  authGuard(["SUPERADMIN", "ADMIN"]),
  validateSchema(updateHealthPostSchemaValidation),
  uploadToCloudinary,
  languageMiddleware,
  updateHealthPostController
);
healthPostRouter.patch(
  "/:id/assign",
  authGuard(["SUPERADMIN", "ADMIN"]),
  validateSchema(assignToHealthPost),
  languageMiddleware,
  assignUserToHealthPost
);
healthPostRouter.post(
  "/:id/patient",
  upload.array("images"),
  authGuard(["SUPERADMIN", "ADMIN"]),
  validateSchema(newPatientValidation),
  languageMiddleware,
  createPatientHandler,
);
healthPostRouter.get(
  "/:id/patient",
  authGuard(["SUPERADMIN", "ADMIN"]),
  languageMiddleware,
  getAllPatientHandler
);
healthPostRouter.get(
  "/:id/patient/:userId",
  authGuard(["SUPERADMIN", "ADMIN"]),
  languageMiddleware,
  getAPatientHandler
);
healthPostRouter.delete(
  "/:id/patient/:userId",
  authGuard(["SUPERADMIN", "ADMIN"]),
  languageMiddleware,
  deletePatientRecordHandler
);

export default healthPostRouter;
