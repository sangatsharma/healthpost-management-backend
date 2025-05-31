import "dotenv/config";

const env = process.env.ENV as string;

export const CONFIG = {
  ENV: env,
  PORT: Number(process.env.PORT),
  MAIL: process.env.MAIL as string,
  ACCESS_SECRET: process.env.ACCESS_SECRET as string,
  ACCESS_EXPIRE: env === "PROD" ? String(process.env.ACCESS_EXPIRE) : "7d",
  REFRESH_SECRET: process.env.REFRESH_SECRET as string,
  REFRESH_EXPIRE: process.env.REFRESH_EXPIRE as string,
};
