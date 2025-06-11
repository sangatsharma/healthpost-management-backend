import {
  Request,
  Response,
  NextFunction,
} from "express";
import {
  responseMessageEnglish,
  responseMessageNepali,
} from "@app/constants/index.constant";

const languageMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const lang = req.cookies["NEXT_LOCALE"];

  const message = lang === "np" ? responseMessageNepali : responseMessageEnglish;

  res.locals.message = message;

  next();
};

export default languageMiddleware;
