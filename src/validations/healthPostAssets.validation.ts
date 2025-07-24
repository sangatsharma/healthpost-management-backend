import z from "zod";
import { np, en } from "./messages/userAuth.messages";

export const setHealthPostAssetSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    ambulanceCount: z.number({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    oxygenCylinderCount: z.number({
      invalid_type_error: t.invalid_type_string
    }).optional(),
  });
};

export const getHealthPostAssetSchemaValidation = (lang: string) => {

};
