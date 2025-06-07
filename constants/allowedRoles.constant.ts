const allowedRolesByAccountType = {
  PATIENT: ["PATIENT"],
  HP: [
    "ADMIN",
    "HEALTH_ASSISTANT",
    "ANM",
    "LAB_TECHNICIAN",
    "FCHV",
    "INVENTORY_KEEPER",
    "OFFICE_HELPER",
  ],
  ADMIN: ["SUPERADMIN"],
};

export default allowedRolesByAccountType;
