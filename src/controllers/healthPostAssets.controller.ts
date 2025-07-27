import { successResponse } from "@app/utils/response.utils";
import { Request, Response, NextFunction } from "express";
import { RepoManager } from "../repository/index.repository";
import { AddHealthPostAssetInput, CreateAssetTypeInput, EngageAssetInput } from "../validations/healthPostAssets.valiadtion";

export const createAssetTypeController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as CreateAssetTypeInput;

  const assetType = await RepoManager.healthPostRepository.createAssetType(body);

  return successResponse({
    res,
    message: "Asset Type Created Successfully",
    data: assetType
  });
};


export const addHealthPostAssetController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as AddHealthPostAssetInput;

  const asset = await RepoManager.healthPostRepository.addHealthPostAsset(body);

  return successResponse({
    res,
    message: "HealthPost Asset Added/Updated Successfully",
    data: asset
  });
};


export const engageAssetController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const body = req.body as EngageAssetInput;

  const engagement = await RepoManager.healthPostRepository.engageAsset(body);

  return successResponse({
    res,
    message: "Asset Engaged Successfully",
    data: engagement
  });
};


export const releaseAssetController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { engagementId } = req.params;

  const engagement = await RepoManager.healthPostRepository.releaseAsset(engagementId);

  return successResponse({
    res,
    message: "Asset Released Successfully",
    data: engagement
  });
};

export const getAvailableAssetsController = async (
  req: Request,
  res: Response,
  _: NextFunction
) => {
  const { healthPostId } = req.params;

  const assets = await RepoManager.healthPostRepository.getAvailableAssets(healthPostId);

  return successResponse({
    res,
    message: "Available Assets Fetched Successfully",
    data: assets
  });
};
