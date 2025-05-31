import { Request, Response, NextFunction } from "express";

import {
  customErrors,
  errorResponse
} from "@app/utils/index.utils";
import {
  statusCodes
} from "@app/constants/index.constant";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JsonWebTokenError } from "jsonwebtoken";

export default function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction) {

  if (err instanceof customErrors.CustomError) {
    return errorResponse({
      res,
      statusCode: err.statusCode,
      err: err.error,
    });
  }
  else if (err instanceof PrismaClientKnownRequestError) {
    const code = err.code;
    const modelName = err.meta?.modelName as string;
    const message = err.meta?.cause as string || "Something went wrong";
    const fieldName = err.meta?.["field_name"] as string;

    // P2003 = Failed foreign key constraint
    if (code === "P2003")
      return errorResponse({
        res,
        statusCode: statusCodes.BAD_REQUEST,
        err: {
          success: false,
          error: `Invalid ${fieldName.split("_")[1]}`,
          message: "Record with provided id not found",
          validationErrors: []
        }
      });

    // P2002 = Unique constraint failed
    else if (code === "P2002") {
      const target = err.meta?.target as string[];

      return errorResponse({
        res,
        statusCode: statusCodes.BAD_REQUEST,
        err: {
          success: false,
          error: "Unique constraint failed",
          message: `Record with provided ${target.join(", ")} already exists`,
          validationErrors: []
        }
      });
    }


    return errorResponse({
      res,
      statusCode: statusCodes.BAD_REQUEST,
      err: {
        success: false,
        error: `Invalid ${modelName?.toLowerCase() ?? ""}Id`,
        message: message,
        validationErrors: []
      }
    });

  }
  else if (err instanceof SyntaxError) {
    return errorResponse({
      res,
      statusCode: statusCodes.BAD_REQUEST,
      err: {
        success: false,
        error: "Syntax Error",
        message: "Syntax Error"
      }
    });
  }
  else if (err instanceof JsonWebTokenError) {
    return errorResponse({
      res,
      statusCode: statusCodes.UNAUTHORIZED,
      err: {
        success: false,
        error: err.name,
        message: err.message
      }
    });
  }

  console.log(err);

  return errorResponse({
    res,
    statusCode: statusCodes.INTERNAL_SERVER_ERROR,
    err: {
      success: false,
      message: "Something went wrong",
      error: "Something went wrong",
    }
  });
}
