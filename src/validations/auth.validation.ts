import { z } from "zod";
import { np } from "./messages/userAuth.messages";
import { en } from "./messages/userAuth.messages";
import {
  ROLE,
  PERMISSIONS,
  UserType,
  ACTION,
} from "@prisma/client";

export const userRegisterSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    fullName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    email: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).email({
      message: "Invalid email format",
    }),
    role: z.nativeEnum(ROLE),
    permission: z.nativeEnum(PERMISSIONS),
    accountType: z.nativeEnum(UserType),
  });
};

export const userLoginSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    email: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).email({
      message: "Invalid email format",
    }),
  });
};

export const otpSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    email: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    otp: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
  });
};


// Infer types
export type UserRegisterType = z.infer<ReturnType<typeof userRegisterSchemaValidation>>
export type UserLoginType = z.infer<ReturnType<typeof userLoginSchemaValidation>>
export type OtpValidateType = z.infer<ReturnType<typeof otpSchemaValidation>>
