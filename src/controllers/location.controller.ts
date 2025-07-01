import { successResponse } from "@app/utils/response.utils";
import {
  Request,
  Response,
  NextFunction,
} from "express";
import { ProvinceSearchType } from "@app/src/validations/index.validation";
import { LocationHelper } from "@app/src/helpers/index.helper";
import { DistrictSearchType } from "../validations/location.validation";
import customErrors from "@app/utils/customErrors.utils";

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

  const locationData = LocationHelper.locationData;
  const requestedProvince = locationData.provinceList
    .filter((d: { name: string }) => d.name.toLowerCase() === body.province.toLowerCase());

  return successResponse({
    res,
    message: "Loaded",
    data: requestedProvince
  });
};

export const getDistrictDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body as DistrictSearchType;
  const locationData = LocationHelper.locationData;

  // Find the district across all provinces
  let matchedDistrict = null;

  for (const province of locationData.provinceList) {
    // Check if districtList is an array or single object
    const districts = Array.isArray(province.districtList)
      ? province.districtList
      : [province.districtList];

    const foundDistrict = districts.find((district) =>
      district.name.toLowerCase() === body.district.toLowerCase()
    );

    if (foundDistrict) {
      matchedDistrict = foundDistrict;
      break;
    }
  }

  if (!matchedDistrict) {
    throw new customErrors.NotFoundError({
      message: "District not found",
    });
  }

  return successResponse({
    res,
    message: "District municipalities loaded successfully",
    data: {
      district: matchedDistrict.name,
      municipalities: matchedDistrict.municipalityList
    }
  });
};

// export const getDistrictDataHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const body = req.body as DistrictSearchType;
//   const locationData = LocationHelper.locationData;
//
//   const provinceList = locationData.provinceList.filter((d) => {
//     console.log(d);
//     return d.districtList.name.toLowerCase() === body.district.toLowerCase();
//   });
//
//   // const requestedProvince = locationData.provinceList
//   //   .filter((d: { name: string }) => d.name.toLowerCase() === body.province.toLowerCase());
//
//   return successResponse({
//     res,
//     message: "Loaded",
//     data: provinceList[0]?.districtList
//   });
// };
