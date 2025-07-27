import { PrismaClient, NoticeType } from "@prisma/client";
import { NoticeSchemaType } from "../validations/notice.validation";

export class NoticeRepository {
  constructor(
    private readonly prisma: PrismaClient["notice"]
  ) { }

  async create(dto: NoticeSchemaType, creatorId: string) {
    return await this.prisma.create({
      data: {
        description: dto.description,
        type: dto.type,
        toIds: dto.toIds || [],
        createdById: creatorId
      }
    });
  }

  async getAllForSuperadmin() {
    return await this.prisma.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getForHealthPost(healthPostId: string) {
    return await this.prisma.findMany({
      where: {
        OR: [
          { type: NoticeType.ALL },
          {
            type: NoticeType.HP,
            toIds: { has: healthPostId }
          }
        ]
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getForPatient(patientId: string) {
    return await this.prisma.findMany({
      where: {
        OR: [
          { type: NoticeType.ALL },
          {
            type: NoticeType.PATIENT,
            toIds: { has: patientId }
          }
        ]
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async getById(id: string) {
    return await this.prisma.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: string, dto: Partial<NoticeSchemaType>) {
    return await this.prisma.update({
      where: {
        id
      },
      data: {
        description: dto.description,
        type: dto.type,
        toIds: dto.toIds
      }
    });
  }

  async delete(id: string) {
    return await this.prisma.delete({
      where: {
        id
      }
    });
  }
}
