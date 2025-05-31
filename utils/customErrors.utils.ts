import { statusCodes } from "@app/constants/index.constant";

export type validationErrors = {
  path: string | number,
  message: string,
}[];

// Parent asbtract class for all CustomError
abstract class CustomError extends Error {

  abstract statusCode: number;

  // Format for error messages
  abstract readonly error: {
    success: boolean,
    message: string,
    error: string,
    validationErrors?: validationErrors,
  };

  constructor(message: string) {
    super(message);
  }
}

class ValidationError extends CustomError {
  validationErrors: validationErrors;
  code: number;

  // Validation errors requires validation error field values
  constructor({
    validationErrors,
    code
  }: {
    validationErrors: validationErrors,
    code?: number
  }) {
    const message = "ValidationError";
    super(message);

    this.name = message;
    this.validationErrors = validationErrors;
    this.code = code || statusCodes.BAD_REQUEST;
  }

  get error() {
    return {
      success: false,
      message: this.name,
      error: "Validation failed for certain fields",
      validationErrors: this.validationErrors,
    };
  }
  get statusCode() {
    return this.code;
  }
}

class DbError extends CustomError {
  code: number;

  constructor({
    message,
    code
  }: {
    message: string,
    code?: number
  }) {
    super(message);
    this.name = "DatabaseError";
    this.code = code || statusCodes.BAD_REQUEST;
  }

  get error() {
    return {
      success: false,
      message: this.name,
      error: this.message,
      validationError: [],
    };
  }

  get statusCode() {
    return this.code;
  }
}

// Unauthorized or Forbidden
class AccessError extends CustomError {
  code: number;
  name: string;

  constructor({
    message,
    name
  }: {
    message: string,
    name: string
  }) {
    super(message);
    this.name = name;
    this.code = name.toUpperCase() === "UNAUTHORIZED" ? statusCodes.UNAUTHORIZED : statusCodes.FORBIDDEN;
  }

  get error() {
    return {
      success: false,
      message: this.name,
      error: this.message,
      validationError: []
    };
  };
  get statusCode() {
    return this.code;
  }
}


class GeneralError extends CustomError {
  code: number;

  constructor({
    name,
    message,
    code
  }: {
    name: string,
    message: string,
    code?: number
  }) {
    super(message);
    this.name = name;
    this.code = code || statusCodes.BAD_REQUEST;
  }

  get error() {
    return {
      success: false,
      message: this.name,
      error: this.message,
      validationError: [],
    };
  }

  get statusCode() {
    return this.code;
  }
}

class BadRequestError extends CustomError {
  code: number;

  constructor({
    message,
  }: {
    message: string,
  }) {
    super(message);
    this.name = "BadRequest";
    this.code = statusCodes.BAD_REQUEST;
  }

  get error() {
    return {
      success: false,
      message: this.name,
      error: this.message,
      validationError: [],
    };
  }

  get statusCode() {
    return this.code;
  }
}

class NotFoundError extends CustomError {
  code: number;

  constructor({
    message,
  }: {
    message: string,
  }) {
    super(message);
    this.name = "NotFound";
    this.code = statusCodes.NOT_FOUND;
  }

  get error() {
    return {
      success: false,
      message: this.name,
      error: this.message,
      validationError: [],
    };
  }

  get statusCode() {
    return this.code;
  }
}

const customErrors = {
  CustomError,
  ValidationError,
  AccessError,
  DbError,
  GeneralError,
  NotFoundError,
  BadRequestError
};

export default customErrors;
