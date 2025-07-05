import { PrismaClient } from "@prisma/client";
import { prisma } from "@app/utils/index.utils";
import { UserRepository } from "./user.repository";
import { HealthPostRepository } from "./healthpost.repository";
import { PatientRepository } from "./patient.repository";

export class RepoManager {
  private static prisma: PrismaClient = prisma;
  private static userRepo: UserRepository;
  private static healthPostRepo: HealthPostRepository;
  private static patientRepo: PatientRepository;

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

  static get patientRepository() {
    if (!this.patientRepo)
      this.patientRepo = new PatientRepository(this.prisma.patient);

    return this.patientRepo;
  }
}
