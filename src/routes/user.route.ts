import express from "express";
import {
  getAllUsersHandler,
  getOneUserHandler,
  getUserHandler,
  updateUserHandler,
  updateUserAdminHandler
} from "@app/src/controllers/index.controller";
import {
  authGuard,
} from "@app/src/helpers/index.helper";
import { validateSchema } from "@app/utils/index.utils";
import {
  updateUserAdminValidation,
  updateUserValidation,
} from "@app/src/validations/index.validation";

const userRouter = express.Router();

userRouter.get("", authGuard(), getUserHandler);
userRouter.get(
  "/all",
  authGuard(["SUPERADMIN"]),
  getAllUsersHandler
);
userRouter.get(
  "/:id",
  authGuard(),
  getOneUserHandler
);

// Update by patient
userRouter.put(
  "/:id",
  authGuard(),
  validateSchema(updateUserValidation),
  updateUserHandler
);

userRouter.put(
  "/:id/admin",
  authGuard(["SUPERADMIN", "ADMIN"]),
  validateSchema(updateUserAdminValidation),
  updateUserAdminHandler
);

export default userRouter;
