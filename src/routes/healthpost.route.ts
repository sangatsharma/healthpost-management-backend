import express from "express";

import {
  validateSchema,
} from "@app/utils/index.utils";
import {
  newHealthPostSchemaValidation,
} from "@app/src/validations/index.validation";
import {
  addNewHealthPostController,
  getAHealthPostController,
  getHealthPostController,
  removeHealthPostController,
} from "@app/src/controllers/index.controller";
import {
  authGuard,
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
  addNewHealthPostController
);
healthPostRouter.get(
  "",
  authGuard(["SUPERADMIN"]),
  getHealthPostController
);
healthPostRouter.get(
  "/:id",
  authGuard(["SUPERADMIN", "ADMIN"]),
  getAHealthPostController
);
healthPostRouter.delete(
  "/:id",
  authGuard(["SUPERADMIN"]),
  removeHealthPostController
);

export default healthPostRouter;
