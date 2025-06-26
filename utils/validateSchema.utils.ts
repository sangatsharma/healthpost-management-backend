import { Record } from "@prisma/client/runtime/library";
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
    const lang = req.cookies["NEXT_LOCALE"];
    try {

      if (req.path === "/register") {
        const rawPermissions: Record<string, Record<string, string>> = {};

        Object.keys(req.body).forEach(key => {
          const match = key.match(/^permissions\[(\d+)\]\.(action|resource)$/);
          if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!rawPermissions[index])
              rawPermissions[index] = {};
            rawPermissions[index][field] = req.body[key];
            delete req.body[key];
          }
        });

        const permissions: Record<string, string>[] = [];

        Object.keys(rawPermissions).forEach((key) => {
          permissions.push(rawPermissions[key]);
        });
        req.body.permissions = permissions;
      }

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
