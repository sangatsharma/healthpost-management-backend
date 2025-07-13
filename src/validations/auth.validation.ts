import { z } from "zod";
import { np } from "./messages/userAuth.messages";
import { en } from "./messages/userAuth.messages";
import {
  ROLE,
  UserType,
  GENDER,
  STATUS,
} from "@prisma/client";

export const userRegisterSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  const { PATIENT: PATIENT_ROLE, ...RestRole } = ROLE;
  const { PATIENT: PATIENT_TYPE, ...RestUserType } = UserType;

  return z.object({
    firstName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    middleName: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    lastName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    email: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).email({
      message: "Invalid email format",
    }),
    phoneNumber: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional(),
    gender: z.nativeEnum(GENDER).optional(),
    accountType: z.nativeEnum(RestUserType),
    role: z.nativeEnum(RestRole),
    status: z.nativeEnum(STATUS).optional(),
    permissions: z.string().optional(),
    healthPostId: z.string({
      invalid_type_error: t.invalid_type_string
    }).optional()
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

    accountType: z.nativeEnum(UserType)
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
