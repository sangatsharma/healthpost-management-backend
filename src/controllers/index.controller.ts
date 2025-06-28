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
  updateHealthPostController,
  assignUserToHealthPost
} from "./healthpost.controller";

import {
  getUserHandler,
  getOneUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  updateUserAdminHandler
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
  assignUserToHealthPost,

  getUserHandler,
  getOneUserHandler,
  getAllUsersHandler,
  updateUserHandler,
  updateUserAdminHandler,
};
