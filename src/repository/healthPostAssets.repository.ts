import { PrismaClient } from "@prisma/client";

export class HealthPostRepository {
  constructor(
    private readonly prisma: PrismaClient["healthPost"],
  ) { };

  async addNewAssets() {

  }
}

