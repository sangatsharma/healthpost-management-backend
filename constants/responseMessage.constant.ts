export const responseMessageEnglish = {
  PRE_LOGIN: {
    SUCCESS: "OTP sent successfully",
    FAIL: {
      UNKNOWN: "Failed to send OTP. Try again later",
      TOO_FAST: "Wait a moment"
    },
  },
  LOGIN: {
    SUCCESS: "Login successful",
    FAIL: {
      INVALID_EMAIL: "User not found",
      ALREADY_LOGGED_IN: "User already loggedin",
      EXPIRED_OTP: "OTP already expired",
      INVALID_OTP: "Invalid OTP",
    }
  },
  REGISTER: {
    SUCCESS: "Register successful",
  },
  LOGOUT: {
    SUCCESS: "Logout successful"
  },
  REGEN_ACCESS: {
    SUCCESS: "New token generated"
  },

  CREATE_HEALTHPOST: {
    SUCCESS: "Successfully created healthpost",
    FAIL: {

    }
  },

  FETCH_HEALTHPOST: {
    MANY: {
      SUCESS: "Fetched healthposts",
    },
    SINGLE: {
      SUCCESS: "Fetched healthpost",
      FAIL: {
      }
    }
  },
  REMOVE_HEALTHPOST: {
    SUCCESS: "Healthpost deleted",
  },

  AUTH_GUARD: {
    LOGIN: "Please login to continue",
    ROLE: "Insufficient permission"
  },
  COMMON: {
    NOT_FOUND: "Resource not found",
  }
};

export const responseMessageNepali = {
  PRE_LOGIN: {
    SUCCESS: "OTP सफलतापूर्वक पठाइयो",
    FAIL: {
      UNKNOWN: "OTP पठाउन असफल भयो। पछि फेरि प्रयास गर्नुहोस्।",
      TOO_FAST: "एक क्षण पर्खनुहोस्"
    }
  },
  LOGIN: {
    SUCCESS: "लगइन सफल भयो",
    FAIL: {
      INVALID_EMAIL: "प्रयोगकर्ता फेला परेन",
      ALREADY_LOGGED_IN: "प्रयोगकर्ता पहिल्यै लगइन गरिएको छ",
      EXPIRED_OTP: "OTP म्याद सकियो",
      INVALID_OTP: "गलत OTP",
    }
  },

  REGISTER: {
    SUCCESS: "दर्ता सफल भयो",
  },

  LOGOUT: {
    SUCCESS: "लगआउट सफल भयो"
  },
  REGEN_ACCESS: {
    SUCCESS: "सफल"
  },
  CREATE_HEALTHPOST: {
    SUCCESS: "हेल्थपोस्ट सफलतापूर्वक सिर्जना गरियो",
    FAIL: {

    }
  },

  FETCH_HEALTHPOST: {
    MANY: {
      SUCCESS: "स्वास्थ्य पोस्टहरू प्राप्त गरियो",
    },
    SINGLE: {
      SUCCESS: "हेल्थपोस्ट भेटियो",
      FAIL: {
      }
    }
  },
  REMOVE_HEALTHPOST: {
    SUCCESS: "हेल्थपोस्ट हटाइयो",
  },

  AUTH_GUARD: {
    LOGIN: "कृपया लगइन गर्नुहोस्",
    ROLE: "अपर्याप्त अनुमति"
  },

  COMMON: {
    NOT_FOUND: "स्रोत फेला परेन",
  }
};
