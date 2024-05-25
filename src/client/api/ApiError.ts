export class ApiError extends Error {
  errors: string[] = [];

  constructor(message: string, errors?: string[]) {
    super(mapErrorMessage(message));
    this.errors = (errors || []).map(mapErrorMessage);
    this.name = "ApiError";
  }

  setMessage(message: string, errors?: string[]) {
    this.message = mapErrorMessage(message);
    this.errors = (errors || []).map(mapErrorMessage);
  }
}

export const UNKNOWN_ERROR = "unknown-error";

const INVALID_CREDENTIALS = "Login failed. Invalid username or password!";

const USERNAME_ALREADY_EXISTS = "Person with this username already exists!";
const USERNAME_ALREADY_EXISTS2 =
  "username - Person with this username already exists!;";

const EMAIL_INVALID = "email - must be a well-formed email address;";
const EMAIL_ALREADY_EXISTS = "Person with this email already exists!";

const REGISTRATION_FAILED = "Registration failed";

function mapErrorMessage(message: string): string {
  switch (message) {
    case INVALID_CREDENTIALS:
      return "invalid-credentials";

    case USERNAME_ALREADY_EXISTS:
    case USERNAME_ALREADY_EXISTS2:
      return "username-already-exists";

    case EMAIL_INVALID:
      return "email-invalid";

    case EMAIL_ALREADY_EXISTS:
      return "email-already-exists";

    case REGISTRATION_FAILED:
      return "registration-failed";

    default:
      return message;
  }
}
