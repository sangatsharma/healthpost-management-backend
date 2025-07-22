import { PrismaClient } from "@prisma/client";

export class MedicineRepository {
  constructor(
    private readonly prisma: PrismaClient["medicine"]
  ) { }

  async find(id: string) {
    return await this.prisma.findUnique({
      where: {
        id
      }
    });
  }
}
