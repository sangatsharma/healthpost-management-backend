import express from "express";
import authGuard from "../helpers/authGuard.helper";
import { validateSchema } from "@app/utils/validateSchema.utils";
import {
  createAssetTypeController,
  addHealthPostAssetController,
  engageAssetController,
  releaseAssetController,
  getAvailableAssetsController,
} from "../controllers/healthPostAssets.controller";
import {
  createAssetTypeSchemaValidation,
  addHealthPostAssetSchemaValidation,
  engageAssetSchemaValidation,
} from "../validations/healthPostAssets.valiadtion";


const assetRouter = express.Router();

// Create Asset Type (SUPERADMIN only)
assetRouter.post(
  "/types",
  authGuard(["SUPERADMIN"]),
  validateSchema(createAssetTypeSchemaValidation),
  createAssetTypeController
);

// Add/Update HealthPost Asset (Admin/ANM/HA)
assetRouter.post(
  "",
  authGuard(["SUPERADMIN", "ADMIN", "ANM", "HEALTH_ASSISTANT"]),
  validateSchema(addHealthPostAssetSchemaValidation),
  addHealthPostAssetController
);

// Engage Asset (Admin/ANM/HA)
assetRouter.post(
  "/engage",
  authGuard(["SUPERADMIN", "ADMIN", "ANM", "HEALTH_ASSISTANT"]),
  validateSchema(engageAssetSchemaValidation),
  engageAssetController
);

// Release Asset by Engagement ID
assetRouter.put(
  "/release/:engagementId",
  authGuard(["SUPERADMIN", "ADMIN", "ANM", "HEALTH_ASSISTANT"]),
  releaseAssetController
);

// Get Available Assets for a HealthPost
assetRouter.get(
  "/available/:healthPostId",
  authGuard(),
  getAvailableAssetsController
);

export default assetRouter;
