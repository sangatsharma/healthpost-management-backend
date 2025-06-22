import express from "express";

import {
  upload,
  validateSchema,
} from "@app/utils/index.utils";
import {
  assignToHealthPost,
  newHealthPostSchemaValidation,
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
  authGuard(["SUPERADMIN", "ADMIN"]),
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
  authGuard(["SUPERADMIN"]),
  validateSchema(updateHealthPostSchemaValidation),
  languageMiddleware,
  updateHealthPostController
);
healthPostRouter.patch(
  "/:id/assign",
  authGuard(["ADMIN"]),
  validateSchema(assignToHealthPost),
  languageMiddleware,
  assignUserToHealthPost
);

export default healthPostRouter;
