import express from "express";
import {
  getAllLocationHandler,
  getDistrictDataHandler,
  getProvinceDataHandler
} from "@app/src/controllers/index.controller";
import { validateSchema } from "@app/utils/index.utils";
import { districtSearchValidation, provinceSearchValidation } from "@app/src/validations/index.validation";

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

locationRouter.get(
  "/district",
  validateSchema(districtSearchValidation),
  getDistrictDataHandler
);

export default locationRouter;
