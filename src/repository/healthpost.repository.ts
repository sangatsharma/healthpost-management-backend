import { PrismaClient, HealthPost, HealthPostAssetType, HealthPostAsset, AssetEngagement } from "@prisma/client";
import {
  NewHealthPostType,
  UpdateHealthPostType,
} from "@app/src/validations/index.validation";
import { AddHealthPostAssetInput, CreateAssetTypeInput, EngageAssetInput } from "../validations/healthPostAssets.valiadtion";

export class HealthPostRepository {
  constructor(
    private readonly prisma: PrismaClient["healthPost"],
    private readonly healthPostConfig: PrismaClient["healthPostConfig"],
    private readonly healthPostAssetType: PrismaClient["healthPostAssetType"],
    private readonly healthPostAssets: PrismaClient["healthPostAsset"],
    private readonly assetEngagement: PrismaClient["assetEngagement"],
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

  async createAssetType(data: CreateAssetTypeInput) {
    return await this.healthPostAssetType.create({
      data: data
    });
  }

  async addHealthPostAsset(data: AddHealthPostAssetInput) {
    return await this.healthPostAssets.upsert({
      where: {
        healthPostId_assetTypeId: {
          healthPostId: data.healthPostId,
          assetTypeId: data.assetTypeId
        }
      },
      update: {
        totalCount: data.totalCount
      },
      create: data
    });
  }


  async engageAsset(data: EngageAssetInput) {
    const asset = await this.healthPostAssets.findUniqueOrThrow({
      where: { id: data.assetId }
    });

    if (asset.engagedCount >= asset.totalCount) {
      throw new Error("No available assets to engage");
    }

    await this.healthPostAssets.update({
      where: { id: data.assetId },
      data: {
        engagedCount: { increment: 1 }
      }
    });

    return await this.assetEngagement.create({
      data: data
    });
  }

  async releaseAsset(engagementId: string) {
    const engagement = await this.assetEngagement.findUniqueOrThrow({
      where: { id: engagementId }
    });

    if (engagement.releasedAt) {
      throw new Error("Asset already released");
    }

    await this.healthPostAssets.update({
      where: { id: engagement.assetId },
      data: {
        engagedCount: { decrement: 1 }
      }
    });

    return await this.assetEngagement.update({
      where: { id: engagementId },
      data: {
        releasedAt: new Date()
      }
    });
  }

  async getAvailableAssets(healthPostId: string) {
    const assets = await this.healthPostAssets.findMany({
      where: { healthPostId },
      include: {
        assetType: true
      }
    });

    return assets.map(asset => ({
      assetTypeName: asset.assetType.name,
      totalCount: asset.totalCount,
      engagedCount: asset.engagedCount,
      availableCount: asset.totalCount - asset.engagedCount
    }));
  }
}
