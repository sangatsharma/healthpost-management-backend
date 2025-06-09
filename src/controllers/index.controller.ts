import {
  userLoginController,
  userRegisterController,
  valiadteOtpController,
  userLogoutHandler,
  refreshAccessToken,
  adminLoginController
} from "./auth.controller";

import {
  addNewHealthPostController,
  getHealthPostController,
  getAHealthPostController,
  removeHealthPostController,
  updateHealthPostController
} from "./healthpost.controller";

import {
  getUserHandler
} from "./user.controller";

export {
  userLoginController,
  userRegisterController,
  valiadteOtpController,
  userLogoutHandler,
  refreshAccessToken,
  adminLoginController,

  addNewHealthPostController,
  getHealthPostController,
  getAHealthPostController,
  removeHealthPostController,
  updateHealthPostController,

  getUserHandler
};
