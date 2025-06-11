import { PrismaClient } from "@prisma/client";
import { prisma } from "@app/utils/index.utils";
import { UserRepository } from "./user.repository";
import { HealthPostRepository } from "./healthpost.repository";

export class RepoManager {
  private static prisma: PrismaClient = prisma;
  private static userRepo: UserRepository;
  private static healthPostRepo: HealthPostRepository;

  static get userRepository() {
    if (!this.userRepo)
      this.userRepo = new UserRepository(this.prisma.user);

    return this.userRepo;
  }

  static get healthPostRepository() {
    if (!this.healthPostRepo)
      this.healthPostRepo = new HealthPostRepository(this.prisma.healthPost);

    return this.healthPostRepo;
  }
}
