import express from "express";
import {
  getAllUsersHandler,
  getOneUserHandler,
  getUserHandler,
} from "@app/src/controllers/index.controller";
import { authGuard } from "@app/src/helpers/index.helper";

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

export default userRouter;
