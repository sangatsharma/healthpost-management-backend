import { PrismaClient, HealthPost } from "@prisma/client";
import { NewHealthPostType, UpdateHealthPostType } from "@app/src/validations/index.validation";

export class HealthPostRepository {
  constructor(private readonly prisma: PrismaClient["healthPost"]) { }

  async create(dto: NewHealthPostType): Promise<HealthPost> {
    const healthPost = await this.prisma.create({
      data: dto
    });

    return healthPost;
  }

  async getAll(): Promise<HealthPost[]> {
    const healthPosts = await this.prisma.findMany({});
    return healthPosts;
  }

  async findById(id: string): Promise<HealthPost | null> {
    const healthPost = await this.prisma.findUnique({
      where: {
        id: id
      }
    });

    return healthPost;
  }

  async delete(id: string): Promise<HealthPost | null> {
    const healthPost = await this.prisma.delete({
      where: {
        id: id
      }
    });

    return healthPost;
  }

  async update(id: string, dto: UpdateHealthPostType): Promise<HealthPost | null> {
    const updatedHealthPost = await this.prisma.update({
      where: {
        id: id
      },
      data: dto
    });

    return updatedHealthPost;
  }
}
