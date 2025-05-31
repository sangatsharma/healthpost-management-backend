import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

export function validateSchema(
  schema: (lang: string) => ZodSchema
) {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const lang = req.cookies["locale"];

    try {
      const parshed_data = schema(lang).parse(req.body);
      req.body = parshed_data;
      next();
    }
    catch (err) {

      // Handling validation errors here
      // Extract path and messages from ZodError
      if (err instanceof ZodError) {

        const validationErrors: {
          path: string | number,
          message: string
        }[] = [];

        for (const error of err.errors) {
          const d: {
            path: (string | number),
            message: string,
          } = {
            path: "",
            message: "",
          };

          d.path = error.path[0];
          d.message = error.message;

          validationErrors.push(d);
        }

        res.status(400).send({
          success: false,
          message: "Validation failed",
          validationErrors: validationErrors
        });
      }
      else {
        console.log(err);

        res.status(500).send({
          success: false,
          message: "Internal Server Error"
        });
      }
    }
  };
}
