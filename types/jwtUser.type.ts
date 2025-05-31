import { PERMISSIONS, ROLE } from "@prisma/client";

export type UserJwt = {
  id: string,
  email: string,
  role: ROLE,
  permission: PERMISSIONS
}
