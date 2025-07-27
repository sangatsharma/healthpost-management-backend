import { z } from "zod";
import { np, en } from "./messages/userAuth.messages";

export const createOpdReferralSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    staffId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).uuid(),
    healthPostId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).uuid(),
    referredHealthPostId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).uuid(),
    patientId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).uuid(),
    opdId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }).uuid(),
    referralReason: z.string().optional().nullable(),
  });
};

export const acceptRejectReferralSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    referralId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    referalStatus: z.enum(["APPROVED", "REJECTED"], {
      required_error: t.required,
    })
  });
};
export type AcceptRejectReferralInput = z.infer<ReturnType<typeof acceptRejectReferralSchemaValidation>>;
export type CreateOpdReferralInput = z.infer<ReturnType<typeof createOpdReferralSchemaValidation>>;
