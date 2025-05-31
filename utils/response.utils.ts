import { Response } from "express";

export function successResponse({ res, message, data, }:
  {
    res: Response,
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>
  }) {
  res.status(200).json({
    success: true,
    message: message,
    data: data || {},
  });
}

type validationErrors = {
  path: string | number,
  message: string,
}[];

export function errorResponse({ res, statusCode, err }:
  {
    res: Response,
    err: {
      success: boolean,
      message: string,
      error: string,
      validationErrors?: validationErrors,
    }
    statusCode: number,
  }) {

  res.status(statusCode).json(err);
};
