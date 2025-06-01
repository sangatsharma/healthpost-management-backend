import { Request, Response, NextFunction } from "express";
import { errorResponse } from "@app/utils/index.utils";
import { statusCodes } from "@app/constants/index.constant";

export default function unknownEndpoint(
  req: Request,
  res: Response,
  _: NextFunction
) {
  return errorResponse({
    res,
    statusCode: statusCodes.NOT_FOUND,
    err: {
      success: false,
      message: "Unknown Endpoint",
      error: "Unknown Endpoint"
    }
  });
}
