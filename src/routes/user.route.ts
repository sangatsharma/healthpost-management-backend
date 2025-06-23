import express from "express";
import {
  getAllUsersHandler,
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

export default userRouter;
