import { PrismaClient, HealthPost } from "@prisma/client";
import {
  NewHealthPostType,
  UpdateHealthPostType,
} from "@app/src/validations/index.validation";

export class HealthPostRepository {
  constructor(private readonly prisma: PrismaClient["healthPost"]) { }

  async create(dto: NewHealthPostType, images: {
    secure_url: string; public_id: string
  }[]): Promise<HealthPost> {
    const imageUrls = images.map((image) => image.secure_url);

    const healthPost = await this.prisma.create({
      data: {
        ...dto,
        images: {
          set: imageUrls
        }
      }
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

  async update(id: string, dto: UpdateHealthPostType & {
    images?: string[]
  }): Promise<HealthPost | null> {
    const { images, ...rest } = dto;

    const updatedHealthPost = await this.prisma.update({
      where: {
        id: id
      },
      data: {
        ...rest,
        ...(images ? {
          images: {
            push: images
          }
        } : {})
      }
    });

    return updatedHealthPost;
  }
}
