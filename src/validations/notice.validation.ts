import { z } from "zod";
import { np, en } from "./messages/userAuth.messages";
import { NoticeType } from "@prisma/client";

export const noticeSchemaValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    description: z.string({
      required_error: t.required,
      invalid_type_error: t.invalid_type_string
    }),
    type: z.nativeEnum(NoticeType),
    toIds: z.array(z.string({
      invalid_type_error: t.invalid_type_string
    }).uuid()).optional(),
  });
};

export type NoticeSchemaType = z.infer<ReturnType<typeof noticeSchemaValidation>>;
