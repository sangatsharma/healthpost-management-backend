import express from "express";
import {
  removeImageHandler,
} from "@app/src/controllers/index.controller";

const commonRouter = express.Router();

commonRouter.delete(
  "/:id",
  removeImageHandler
);

export default commonRouter;
