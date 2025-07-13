import { PrismaClient, User } from "@prisma/client";
import { AssignUserToHealthPostType, UserRegisterType } from "@app/src/validations/index.validation";
import { ModifiedUser } from "@app/types/index.type";
import { RepoManager } from "./index.repository";

const userModifierFunction = (user: User): ModifiedUser => {
  const {
    firstName,
    middleName,
    lastName,
    permission,
    otp,
    optCreatedAt,
    profileImage,
    ...rest
  } = user;

  return {
    fullName: {
      firstName,
      middleName,
      lastName
    },
    // permissions: JSON.parse(permission as string),
    permissions: permission?.toString() !== "" ? JSON.parse(permission as string) : [],
    profileImage: profileImage ? [profileImage] : [],
    ...rest
  };
};

const allUserModifierFunction = (user: User | User & {
  healthPost: {
    name: string | null
  }
}): ModifiedUser => {
  const {
    firstName,
    middleName,
    lastName,
    permission,
    otp,
    optCreatedAt,
    profileImage,
    ...rest
  } = user;

  return {
    fullName: {
      firstName,
      middleName,
      lastName
    },
    permissions: permission?.toString() !== "" ? JSON.parse(permission as string) : [],
    profileImage: profileImage ? [profileImage] : [],
    ...rest
  };
};

export class UserRepository {
  constructor(private readonly prisma: PrismaClient["user"]) { }


  async create(dto: UserRegisterType & {
    profileImage?: string
  }): Promise<ModifiedUser> {
    const { permissions, ...rest } = dto;
    const user = await this.prisma.create({
      data: {
        ...rest,
        ...(permissions ? { permission: permissions } : { permission: [] }),
      }
    });
    return userModifierFunction(user);
  }

  async getAll(): Promise<ModifiedUser[]> {
    const users = await this.prisma.findMany({});

    const updatedUsers = users.map(userModifierFunction);

    return updatedUsers;
  }

  async getAllWithHealthpost() {
    const users = await this.prisma.findMany({});
    const hpUser = await Promise.all(users.map(async (user) => {
      if (!user.healthPostId) return user;

      const hp = await RepoManager.healthPostRepository.findById(
        user.healthPostId
      );

      return {
        healthPost: {
          name: hp?.name
        },
        ...user
      };
    }));



    const updatedUsers = hpUser.map(allUserModifierFunction);

    return updatedUsers;

  }

  async findById(id: string): Promise<ModifiedUser | null> {
    const user = await this.prisma.findUnique({
      where: {
        id: id
      }
    });

    return user ? userModifierFunction(user) : user;
  }

  async findByEmail(email: string, modify: boolean = false): Promise<User | ModifiedUser | null> {
    const user = await this.prisma.findUnique({
      where: {
        email: email
      }
    });

    return modify ? user ? userModifierFunction(user) : null : user;
  }

  async updateOtp(id: string, otp: string): Promise<User | null> {
    const user = await this.prisma.update({
      where: {
        id: id
      },
      data: {
        otp: otp,
        optCreatedAt: new Date()
      }
    });

    return user;
  }

  async updateToken(id: string, refreshToken: string): Promise<ModifiedUser | null> {
    const user = await this.prisma.update({
      where: {
        id: id
      },
      data: {
        refreshToken: refreshToken,
        otp: null,
        optCreatedAt: null,
      }
    });

    return userModifierFunction(user);
  }

  async updateLogout(id: string): Promise<undefined> {
    await this.prisma.update({
      where: {
        id: id
      },
      data: {
        refreshToken: null,
        otp: null,
        optCreatedAt: null,
      }
    });

    return;
  }

  async update(
    id: string,
    data: Partial<User> & {
      permission?: string | undefined
    },
  ): Promise<ModifiedUser> {
    const updatedUser = await this.prisma.update({
      where: {
        id: id
      },
      data: data
    });

    return userModifierFunction(updatedUser);
  }

  async clearOtp(userId: string): Promise<ModifiedUser> {
    const user = await this.prisma.update({
      where: {
        id: userId,
      },
      data: {
        otp: null,
        optCreatedAt: null
      }
    });

    return userModifierFunction(user);
  }

  async assignUser(dto: AssignUserToHealthPostType & {
    healthPostId: string
  }): Promise<ModifiedUser> {
    const user = await this.prisma.update({
      where: {
        id: dto.userId,
      },
      data: {
        healthPostId: dto.healthPostId,
      }
    });

    return userModifierFunction(user);
  }

  async deleteUser(id: string) {
    await this.prisma.delete({
      where: {
        id: id
      }
    });
  }
}
