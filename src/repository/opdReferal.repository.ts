import { PrismaClient } from "@prisma/client";
import { OpdReferalType } from "../validations/opdReferal.validation";

export class OpdReferalRepository {
  constructor(
    private readonly prisma: PrismaClient["opdReferral"]
  ) { }

  async create(dto: OpdReferalType) {
    return await this.prisma.create({
      data: dto
    });
  }

  async getReferredForHp(hId: string) {
    return await this.prisma.findMany({
      where: {
        referredHealthPostId: hId
      }
    });
  }

  async getReferringForHp(hId: string) {
    return await this.prisma.findMany({
      where: {
        healthPostId: hId
      }
    });
  }

  async getByPatientId(pId: string) {
    return await this.prisma.findMany({
      where: {
        patientId: pId
      }
    });
  }

  async getById(id: string) {
    return await this.prisma.findUnique({
      where: {
        id: id
      }
    });
  }
}
