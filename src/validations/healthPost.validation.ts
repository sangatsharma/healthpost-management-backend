import z from "zod";
import { np } from "./messages/userAuth.messages";
import { en } from "./messages/userAuth.messages";
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
    wardNo: z.number({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    status: z.nativeEnum(HealthPostStatus)
  });
};

export const updateHealthPostSchemaValidation = (lang: string) => {
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
      invalid_type_error: t.invalid_type_string
    }).optional(),
    adminId: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    wardNo: z.number({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    status: z.nativeEnum(HealthPostStatus).optional()
  }).refine((input) => Object.keys(input).length >= 1, {
    message: "Atleast one field required"
  });
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
