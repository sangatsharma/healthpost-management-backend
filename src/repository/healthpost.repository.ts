import { PrismaClient, HealthPost } from "@prisma/client";
import {
  NewHealthPostType,
  UpdateHealthPostType,
} from "@app/src/validations/index.validation";

export class HealthPostRepository {
  constructor(
    private readonly prisma: PrismaClient["healthPost"],
    private readonly healthPostConfig: PrismaClient["healthPostConfig"],
  ) { }

  async create(dto: NewHealthPostType, images: {
    secure_url: string; public_id: string
  }[]): Promise<HealthPost> {
    const imageUrls = images.map((image) => image.secure_url);
    const { isOpen, ...rest } = dto;
    const healthPost = await this.prisma.create({
      data: {
        ...rest,
        images: {
          set: imageUrls
        },
        config: {
          create: {
            isOpen
          }
        },
      },
      include: {
        config: true
      }
    });

    return healthPost;
  }

  async getAll(): Promise<HealthPost[]> {
    const healthPosts = await this.prisma.findMany({
      include: {
        config: true
      }
    });
    return healthPosts;
  }

  async findById(id: string): Promise<HealthPost | null> {
    const healthPost = await this.prisma.findUnique({
      where: {
        id: id
      },
      include: {
        config: true
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

  async toggleIsOpen(id: string, isOpen: boolean) {
    return await this.healthPostConfig.update({
      where: {
        id
      },
      data: {
        isOpen
      },
    });
  }
}
