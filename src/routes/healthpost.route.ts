import express from "express";

import {
  validateSchema,
} from "@app/utils/index.utils";
import {
  newHealthPostSchemaValidation,
  updateHealthPostSchemaValidation,
} from "@app/src/validations/index.validation";
import {
  addNewHealthPostController,
  getAHealthPostController,
  getHealthPostController,
  removeHealthPostController,
  updateHealthPostController,
} from "@app/src/controllers/index.controller";
import {
  authGuard,
  languageMiddleware,
} from "@app/src/helpers/index.helper";

const healthPostRouter = express.Router();

// Add new healthpost

/*  DOC
 *  - 
 *
 */
healthPostRouter.post(
  "",
  authGuard(["SUPERADMIN"]),
  validateSchema(newHealthPostSchemaValidation),
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
  authGuard(["SUPERADMIN"]),
  validateSchema(updateHealthPostSchemaValidation),
  languageMiddleware,
  updateHealthPostController
);

export default healthPostRouter;
