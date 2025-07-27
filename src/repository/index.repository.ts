import { PrismaClient } from "@prisma/client";
import { prisma } from "@app/utils/index.utils";
import { UserRepository } from "./user.repository";
import { HealthPostRepository } from "./healthpost.repository";
import { PatientRepository } from "./patient.repository";
import { MedicineRepository } from "./medicine.repository";
import { OpdVisitRepository } from "./opd.repository";
import { NoticeRepository } from "./notice.repository";

export class RepoManager {
  private static prisma: PrismaClient = prisma;
  private static userRepo: UserRepository;
  private static healthPostRepo: HealthPostRepository;
  private static patientRepo: PatientRepository;
  private static medicineRepo: MedicineRepository;
  private static opdVisitRepo: OpdVisitRepository;
  private static noticeRepo: NoticeRepository;

  static get userRepository() {
    if (!this.userRepo)
      this.userRepo = new UserRepository(
        this.prisma.user,
        this.prisma.patient,
      );

    return this.userRepo;
  }

  static get healthPostRepository() {
    if (!this.healthPostRepo)
      this.healthPostRepo = new HealthPostRepository(
        this.prisma.healthPost,
        this.prisma.healthPostConfig,
        this.prisma.healthPostAssetType,
        this.prisma.healthPostAsset,
        this.prisma.assetEngagement
      );

    return this.healthPostRepo;
  }

  static get patientRepository() {
    if (!this.patientRepo)
      this.patientRepo = new PatientRepository(this.prisma.patient);

    return this.patientRepo;
  }

  static get medicineRepository() {
    if (!this.medicineRepo)
      this.medicineRepo = new MedicineRepository(this.prisma.medicine);

    return this.medicineRepo;
  }

  static get opdVisitRepository() {
    if (!this.opdVisitRepo)
      this.opdVisitRepo = new OpdVisitRepository(
        this.prisma.opdVisit,
        this.prisma.opdReferral
      );

    return this.opdVisitRepo;
  }

  static get noticeRepository() {
    if (!this.noticeRepo)
      this.noticeRepo = new NoticeRepository(
        this.prisma.notice
      );

    return this.noticeRepo;
  }
}
