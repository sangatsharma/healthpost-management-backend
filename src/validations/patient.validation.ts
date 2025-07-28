import z from "zod";
import { np, en } from "./messages/userAuth.messages";
import {
  CasteType,
  Nationality,
  BloodGroup,
  DisabilityIdentityType,
  GENDER,
  MarriageStatus,
} from "@prisma/client";


const nullableEnum = <T extends Record<string, string | number>>(enumObj: T) =>
  z.string()
    .transform(val => val === "" ? null : val)
    .nullable()
    .optional()
    .refine(val => val === null || Object.values(enumObj).includes(val as T[keyof T]), {
      message: "Invalid enum value",
    })
    .transform(val => val === null ? null : val as T[keyof T]);

export const newPatientValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  enum DisabilityType {
    PHYSICAL = "PHYSICAL",
    VISUAL = "VISUAL",
    HEARING = "HEARING",
    INTELLECTUAL = "INTELLECTUAL",
    MENTAL = "MENTAL",
    MULTIPLE = "MULTIPLE",
    OTHER = "OTHER",
    NEUROLOGICAL = "NEUROLOGICAL",
    null = "NULL"
  }
  return z.object({
    firstName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    middleName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    lastName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    email: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).email(),
    dobBs: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    gender: z.nativeEnum(GENDER).optional(),
    maritalStatus: z.nativeEnum(MarriageStatus).optional(),
    dobAd: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    weight: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    isVaccineCompleted: z.coerce.boolean().optional(),
    isMinor: z.coerce.boolean().optional(),
    isEligibleForSgc: z.coerce.boolean().optional(),
    casteType: z.nativeEnum(CasteType, {
      required_error: t.required,
    }),
    phone: z.string().optional(),
    phoneNumber: z.string().optional(),
    citizenshipNumber: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    nationalId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    nationality: z.nativeEnum(Nationality, {
      required_error: t.required,
    }),
    height: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    emergencyContact: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    familyHistory: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    districtId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    palityId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    wardNo: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).transform((input) => Number(input)),
    tole: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    tDistrictId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    tPalityId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    tWardNo: z.string({
      invalid_type_error: t.invalid_type_string,
    }).transform((input) => Number(input)).optional().nullable(),
    tTole: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    fatherName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    motherName: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    guardianName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    spouseName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    // lockReport: z.boolean({
    //   required_error: t.required,
    // }),
    lockReport: z.coerce.boolean({
      required_error: t.required,
    }),
    bloodGroup: z.nativeEnum(BloodGroup, {
      required_error: t.required,
    }),
    disabilityType: z.enum(
      ["PHYSICAL", "VISUAL", "HEARING", "INTELLECTUAL", "MENTAL", "MULTIPLE", "OTHER", "null"], {
    }).optional().nullable()
      .transform((value) => value === "null" ? undefined : value),
    disabilityIdentityType: z.nativeEnum(DisabilityIdentityType, {
    }).optional().nullable(),
    nshiNumber: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    bank: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    bankBranch: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
  });

};

export const updatePatientValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    patientId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).uuid(),
    firstName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    middleName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    lastName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    dobBs: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    // gender: z.nativeEnum(GENDER).optional(),
    gender: nullableEnum(GENDER),
    height: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    disabilityType: z.enum(
      ["PHYSICAL", "VISUAL", "HEARING", "INTELLECTUAL", "MENTAL", "MULTIPLE", "OTHER", "null"], {
    }).optional().nullable()
      .transform((value) => value === "null" ? undefined : value),
    weight: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    isVaccineCompleted: z.coerce.boolean().optional(),
    isMinor: z.coerce.boolean().optional(),
    isEligibleForSgc: z.coerce.boolean().optional(),
    profileImage: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    dobAd: z.string({
    }).optional().nullable(),
    casteType: z.nativeEnum(CasteType, {
    }).optional(),
    disabilityIdentityType: nullableEnum(DisabilityIdentityType),
    citizenshipNumber: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    nationalId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    nationality: z.nativeEnum(Nationality, {
      required_error: t.required,
    }).optional(),
    emergencyContact: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    districtId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    familyHistory: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    palityId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    wardNo: z.string({
      invalid_type_error: t.invalid_type_string,
    }).transform((input) => Number(input)).optional(),
    tole: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    tDistrictId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    tPalityId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    tWardNo: z.string({
      invalid_type_error: t.invalid_type_string,
    }).transform((input) => Number(input)).optional().nullable(),
    tTole: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    fatherName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    motherName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    guardianName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    spouseName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    lockReport: z.coerce.boolean({
    }).optional(),
    phoneNumber: z.string().optional(),
    bloodGroup: z.nativeEnum(BloodGroup, {
    }).optional(),
    // disabilityIdentityType: z.nativeEnum(DisabilityIdentityType, {
    // }).optional().nullable(),
    nshiNumber: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    bank: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    bankBranch: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
  });

};

export type NewPatientType = z.infer<ReturnType<typeof newPatientValidation>>
export type UpdatePatientType = z.infer<ReturnType<typeof updatePatientValidation>>
