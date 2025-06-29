import { successResponse } from "@app/utils/response.utils";
import {
  Request,
  Response,
  NextFunction,
} from "express";
import fs from "fs/promises";
import path from "path";
import { ProvinceSearchType } from "@app/src/validations/index.validation";
import { LocationHelper } from "@app/src/helpers/index.helper";

export const getAllLocationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const locationData = LocationHelper.locationData;
  return successResponse({
    res,
    message: "Loaded",
    data: locationData
  });
};

export const getProvinceDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as ProvinceSearchType;
  // const data = await fs.readFile(path.join(__dirname, "../assets/location.json"), "utf8");
  // const locationData = JSON.parse(data);

  const locationData = LocationHelper.locationData;
  const requestedProvince = locationData.provinceList
    .filter((d: { name: string }) => d.name.toLowerCase() === body.province.toLowerCase());

  return successResponse({
    res,
    message: "Loaded",
    data: requestedProvince
  });
};
