import { ACTION, RESOURCES, ROLE } from "@prisma/client";

export type UserJwt = {
  id: string,
  email: string,
  role: ROLE,
  permission: {
    action: ACTION,
    resource: RESOURCES
  }[]
}
