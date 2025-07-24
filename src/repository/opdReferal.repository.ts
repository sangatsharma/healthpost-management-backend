import { PrismaClient } from "@prisma/client";

export class OpdReferalRepository {
  constructor(
    private readonly prisma: PrismaClient["opdReferal"]
  ) { }

}
