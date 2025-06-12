import { CONFIG } from "@app/utils/config.utils";
import { ModifiedUser } from "@app/types/index.type";
import * as jwt from "jsonwebtoken";
import { RepoManager } from "../repository/index.repository";

export class TokenHelper {

  static async genTokens(user: ModifiedUser): Promise<{
    accessToken: string,
    refreshToken: string
  }> {
    const accessPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      accountType: user.accountType,
    };

    const jwtAccessToken = jwt.sign(accessPayload, CONFIG.ACCESS_SECRET, {
      expiresIn: "15m"
    });

    const refreshPayload = {
      id: user.id
    };

    const jwtRefreshToken = jwt.sign(refreshPayload, CONFIG.REFRESH_SECRET, {
      expiresIn: "7d"
    });

    await RepoManager.userRepository.updateToken(user.id, jwtRefreshToken);

    return {
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken
    };
  }

  static regenRefresh(user: ModifiedUser): {
    accessToken: string,
  } {

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      permissions: user.permissions,
      accountType: user.accountType,
    };

    const jwtAccessToken = jwt.sign(payload, CONFIG.ACCESS_SECRET, {
      expiresIn: "15m"
    });

    return {
      accessToken: jwtAccessToken
    };
  }
}
