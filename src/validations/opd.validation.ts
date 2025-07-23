import z, { string } from "zod";
import { np, en } from "./messages/userAuth.messages";
import { Timing, TreatementType, VisitType } from "@prisma/client";

const PrescriptionSchema = z.object({
  name: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
  duration: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
  frequency: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
  intakeTime: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
  quantity: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
  intakeRoute: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
  timing: z.nativeEnum(Timing, {
    required_error: en.required,
  }),
  dosage: z.string({
    required_error: en.required,
    invalid_type_error: en.invalid_type_string,
  }),
});

const VitalsSchema = z.object({
  bp: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
  pulse: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
  temperature: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
  respiration: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
  weight: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
  height: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
  mucus: z.string({
    invalid_type_error: en.invalid_type_string,
  }).optional().nullable(),
});

export const createOpdVisitSchema = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    visitedDate: z.coerce.date({
      required_error: t.required,
    }),
    patientId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).uuid(),
    examinerId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).uuid(),
    healthPostId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }).uuid(),
    complaints: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    diagnosis: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    observedExamination: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    treatment: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string,
    }),
    followUpRequired: z.boolean().optional(),
    followUpDate: z.coerce.date().optional().nullable(),
    isGenderViolence: z.boolean().optional(),
    isPregenant: z.boolean().optional(),
    treatementType: z.nativeEnum(TreatementType, {
      required_error: t.required,
    }),
    visitType: z.nativeEnum(VisitType, {
      required_error: t.required,
    }),
    prescriptions: z.array(PrescriptionSchema, {
      required_error: t.required,
    }),
    medicines: z.array(z.string()),
    Vitals: z.array(VitalsSchema, {
      required_error: t.required,
    }),
  });
};

export type OpdVisitType = z.infer<ReturnType<typeof createOpdVisitSchema>>;
