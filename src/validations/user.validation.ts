import z from "zod";
import { np, en } from "./messages/userAuth.messages";
import { GENDER, STATUS } from "@prisma/client";

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
    status: z.nativeEnum(STATUS).optional(),
    permissions: z.string().optional(),
    profileImage: z.string().optional(),
  }).refine((input) => {
    return Object.values(input).some(value => value !== undefined);
  }, {
    message: t.atleast_one_required,
  });
};

export const updateUserAdminValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({});
};

export type UpdateUserType = z.infer<ReturnType<typeof updateUserValidation>>
export type UpdateUserAdminType = z.infer<ReturnType<typeof updateUserAdminValidation>>
