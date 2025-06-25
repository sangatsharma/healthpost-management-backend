import { User } from "@prisma/client";

export type ModifiedUser = Omit<
  User,
  "firstName" | "middleName" | "lastName" | "permission" | "otp" | "optCreatedAt" | "profileImage"
> & {
  fullName: {
    firstName: string;
    middleName: string | null;
    lastName: string;
  };
  permissions: Record<string, string>[];
  profileImage: string[]
};
