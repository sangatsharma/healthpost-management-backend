import z from "zod";
import { np, en } from "./messages/userAuth.messages";
import PROVINCE from "@app/constants/locationEnum.constant";

export const provinceSearchValidation = (lang: string) => {
  const t = lang === "np" ? np : en;

  return z.object({
    province: z.nativeEnum(PROVINCE),
  });
};

export type ProvinceSearchType = z.infer<ReturnType<typeof provinceSearchValidation>>
