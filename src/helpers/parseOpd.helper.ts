import {
  Request,
  Response,
  NextFunction,
} from "express";

import qs from "qs";

export const parseOpd = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const body = req.body;
  if (!body.prescriptions || !body.Vitials) 
};
