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
  updateUserAdminValidation,
  UpdateUserType,
  UpdateUserAdminType,
} from "./user.validation";
import {
  newPatientValidation,
  updatePatientValidation,
  NewPatientType,
  UpdatePatientType
} from "./patient.validation";

import {
  provinceSearchValidation,
  districtSearchValidation,
  ProvinceSearchType,
  DistrictSearchType
} from "./location.validation";

import {
  createOpdVisitSchema,
  OpdVisitType
} from "./opd.validation";

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
  updateUserAdminValidation,
  UpdateUserType,
  UpdateUserAdminType,

  provinceSearchValidation,
  districtSearchValidation,
  ProvinceSearchType,
  DistrictSearchType,

  newPatientValidation,
  NewPatientType,
  updatePatientValidation,
  UpdatePatientType,

  createOpdVisitSchema,
  OpdVisitType
};
