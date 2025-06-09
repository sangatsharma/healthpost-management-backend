import express from "express";
import { getUserHandler } from "@app/src/controllers/index.controller";
import { authGuard } from "@app/src/helpers/index.helper";

const userRouter = express.Router();

userRouter.get("", authGuard(), getUserHandler);

export default userRouter;
