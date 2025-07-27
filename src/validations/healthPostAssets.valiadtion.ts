import { z } from "zod";
import { np, en } from "./messages/userAuth.messages";

export const createAssetTypeSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    name: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    description: z.string().optional()
  });
};

export const addHealthPostAssetSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    healthPostId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    assetTypeId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    totalCount: z.number({
      required_error: t.required,
    }).min(0)
  });
};


export const engageAssetSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    assetId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    patientId: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    opdVisitId: z.string().optional()
  });
};


export type EngageAssetInput = z.infer<ReturnType<typeof engageAssetSchemaValidation>>;
export type AddHealthPostAssetInput = z.infer<ReturnType<typeof addHealthPostAssetSchemaValidation>>;
export type CreateAssetTypeInput = z.infer<ReturnType<typeof createAssetTypeSchemaValidation>>;
