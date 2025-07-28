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
    toIds: z
      .string({
        invalid_type_error: t.invalid_type_string,
      })
      .optional()
      .transform((value) => {
        if (!value) return []; // Return empty array if undefined or empty
        const a = value.slice(1, -1)
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id.length > 0); // Split string and clean up
        return a;
      })
      .refine(
        (ids) => ids.every((id) => z.string().uuid().safeParse(id).success),
        { message: "All toIds must be valid UUIDs" }
      ),
  });
};

export type NoticeSchemaType = z.infer<ReturnType<typeof noticeSchemaValidation>>;
