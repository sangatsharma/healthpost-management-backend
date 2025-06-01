import z from "zod";
import { np } from "./messages/userAuth.messages";
import { en } from "./messages/userAuth.messages";

export const newHealthPostSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    name: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    location: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    number: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    adminId: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
  });
};

export const updateHealthPostSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    name: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    location: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    number: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    adminId: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
  }).refine((input) => Object.keys(input).length >= 1, {
    message: "Atleast one field required"
  });
};

export type NewHealthPostType = z.infer<ReturnType<typeof newHealthPostSchemaValidation>>
export type UpdateHealthPostType = z.infer<ReturnType<typeof updateHealthPostSchemaValidation>>
