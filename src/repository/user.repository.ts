import { Prisma, PrismaClient, User } from "@prisma/client";
import { UserRegisterType } from "@app/src/validations/index.validation";
import { ModifiedUser } from "@app/types/index.type";


const userModifierFunction = (user: User): ModifiedUser => {
  const {
    firstName,
    middleName,
    lastName,
    permission,
    otp,
    optCreatedAt,
    ...rest
  } = user;

  return {
    fullName: {
      firstName,
      middleName,
      lastName
    },
    permissions: JSON.parse(permission as string),
    ...rest
  };
};

export class UserRepository {
  constructor(private readonly prisma: PrismaClient["user"]) { }


  async create(dto: UserRegisterType & {
    profileImage?: string
  }): Promise<ModifiedUser> {
    const user = await this.prisma.create({
      data: {
        ...dto,
        permission: JSON.stringify(dto.permission),
      }
    });

    return userModifierFunction(user);
  }

  async getAll(): Promise<ModifiedUser[]> {
    const users = await this.prisma.findMany({});

    const updatedUsers = users.map(userModifierFunction);

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
    data: Partial<User>,
  ): Promise<ModifiedUser> {
    const updatedUser = await this.prisma.update({
      where: {
        id: id
      },
      data: data as Prisma.UserUpdateInput
    });

    return userModifierFunction(updatedUser);
  }
}
