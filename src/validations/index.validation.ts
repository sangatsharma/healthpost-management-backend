import {
  userLoginSchemaValidation,
  userRegisterSchemaValidation,
  otpSchemaValidation,
  UserRegisterType,
  UserLoginType,
  OtpValidateType,
} from "./auth.validation";

import {
  newHealthPostSchemaValidation,
  updateHealthPostSchemaValidation,
  assignToHealthPost,
  NewHealthPostType,
  UpdateHealthPostType,
  AssignUserToHealthPostType
} from "./healthPost.validation";

import {
  updateUserValidation,
  UpdateUserType
} from "./user.validation";

export {
  userLoginSchemaValidation,
  userRegisterSchemaValidation,
  otpSchemaValidation,
  UserRegisterType,
  UserLoginType,
  OtpValidateType,

  newHealthPostSchemaValidation,
  updateHealthPostSchemaValidation,
  assignToHealthPost,
  NewHealthPostType,
  UpdateHealthPostType,
  AssignUserToHealthPostType,

  updateUserValidation,
  UpdateUserType
};
