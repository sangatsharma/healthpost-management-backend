import z from "zod";
import { np, en } from "./messages/userAuth.messages";
import { GENDER, ROLE, STATUS } from "@prisma/client";

export const updateUserValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    firstName: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    middleName: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    lastName: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    phoneNumber: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    gender: z.nativeEnum(GENDER).optional(),
  }, {
    required_error: "Body is empty",
  }).refine((input) => {
    return Object.values(input).length !== 0;
  }, {
    message: t.atleast_one_required,
  });
};

export const updateUserAdminValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    userId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    role: z.nativeEnum(ROLE).optional(),
    status: z.nativeEnum(STATUS).optional(),
  }).refine((input) => {
    return Object.values(input).length !== 0;
  }, {
    message: t.atleast_one_required,
  });
};

export type UpdateUserType = z.infer<ReturnType<typeof updateUserValidation>>
export type UpdateUserAdminType = z.infer<ReturnType<typeof updateUserAdminValidation>>
