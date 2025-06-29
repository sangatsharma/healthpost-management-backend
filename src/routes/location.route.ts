import express from "express";
import {
  getAllLocationHandler,
  getProvinceDataHandler
} from "@app/src/controllers/index.controller";
import { validateSchema } from "@app/utils/index.utils";
import { provinceSearchValidation } from "@app/src/validations/index.validation";

const locationRouter = express.Router();

locationRouter.get(
  "/all",
  getAllLocationHandler
);

locationRouter.get(
  "/province",
  validateSchema(provinceSearchValidation),
  getProvinceDataHandler
);

export default locationRouter;
