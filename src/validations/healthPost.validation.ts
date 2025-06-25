import z from "zod";
import { np, en } from "./messages/userAuth.messages";
import { HealthPostStatus } from "@prisma/client";

export const newHealthPostSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    name: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    email: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    municipality: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    location: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    phone: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    wardNo: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).transform((input) => Number(input)),
    status: z.nativeEnum(HealthPostStatus)
  });
};

export const updateHealthPostSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    name: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional().nullable(),
    email: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional().nullable(),
    municipality: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional().nullable(),
    location: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional().nullable(),
    phone: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    adminId: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    wardNo: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional().transform((value) => value ? Number(value) : undefined),
    status: z.nativeEnum(HealthPostStatus).optional()
  }).refine((input) => Object.keys(input).length >= 1, {
    message: "Atleast one field required"
  }).transform((fields) => {
    const transformed = { ...fields };
    if (transformed.name === "null") transformed.name = null;
    if (transformed.email === "null") transformed.email = null;
    if (transformed.municipality === "null") transformed.municipality = null;
    if (transformed.location === "null") transformed.location = null;
    return transformed;
  });;
};

export const assignToHealthPost = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    userId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
  });
};

export type NewHealthPostType = z.infer<ReturnType<typeof newHealthPostSchemaValidation>>
export type UpdateHealthPostType = z.infer<ReturnType<typeof updateHealthPostSchemaValidation>>
export type AssignUserToHealthPostType = z.infer<ReturnType<typeof assignToHealthPost>>
