import { CONFIG, prisma } from "@app/utils/index.utils";
import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";

const jwtTokenGen = async (user: User) => {

  let jsonPermission = user.permission as string[] | null;
  if (jsonPermission)
    jsonPermission = JSON.parse(user.permission as string);

  const jwtAccessPayload = {
    id: user.id,
    email: user.email,
    role: user.role,
    permissions: jsonPermission,
    acountType: user.accountType,
  };

  const jwtRefreshPayload = {
    id: user.id
  };

  const jwtAccessToken = jwt.sign(jwtAccessPayload, CONFIG.ACCESS_SECRET, {
    expiresIn: "15m"
  });

  const jwtRefreshToken = jwt.sign(jwtRefreshPayload, CONFIG.REFRESH_SECRET, {
    expiresIn: "7d"
  });

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      otp: null,
      optCreatedAt: null,
      refreshToken: jwtRefreshToken
    }
  });

  return {
    jwtAccessToken, jwtRefreshToken
  };
};

export default jwtTokenGen;
