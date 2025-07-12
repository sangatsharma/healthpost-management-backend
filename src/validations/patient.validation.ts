import z from "zod";
import { np, en } from "./messages/userAuth.messages";
import {
  CasteType,
  Nationality,
  BloodGroup,
  DisabilityIdentityType,
} from "@prisma/client";

export const newPatientValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

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
    dobAd: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    casteType: z.nativeEnum(CasteType, {
      required_error: t.required,
    }),
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
    userId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).uuid(),
    dobBs: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    dobAd: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    casteType: z.nativeEnum(CasteType, {
    }).optional().nullable(),
    citizenshipNumber: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    nationlId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    nationality: z.nativeEnum(Nationality, {
      required_error: t.required,
    }).optional().nullable(),
    emergencyContact: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    districtId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    palityId: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional(),
    wardNo: z.string({
      invalid_type_error: t.invalid_type_string,
    }).transform((input) => Number(input)).optional().nullable(),
    tole: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
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
    }).optional().nullable(),
    motherName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    guardianName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    spouseName: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
    lockReport: z.boolean({
    }).optional().nullable(),
    bloodGroup: z.nativeEnum(BloodGroup, {
    }).optional().nullable(),
    disabilityIdentityType: z.nativeEnum(DisabilityIdentityType, {
    }).optional().nullable(),
    nshiNumber: z.string({
      invalid_type_error: t.invalid_type_string,
    }).optional().nullable(),
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
