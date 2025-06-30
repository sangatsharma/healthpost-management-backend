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
  updateUserAdminHandler,
  deleteUserHandler
} from "./user.controller";

import {
  getAllLocationHandler,
  getProvinceDataHandler
} from "./location.controller";

import {
  removeImageHandler
} from "./common.controller";

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
  deleteUserHandler,

  getAllLocationHandler,
  getProvinceDataHandler,

  removeImageHandler
};
