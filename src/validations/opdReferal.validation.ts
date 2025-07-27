import { z } from "zod";
import { np, en } from "./messages/userAuth.messages";

export const opdReferalSchemaValidation = (lang: string) => {
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
  });
};

export type OpdReferalType = z.infer<ReturnType<typeof opdReferalSchemaValidation>>;
