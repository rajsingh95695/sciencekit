export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = "Authentication required.") {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = "You do not have permission to perform this action.") {
    super(message, 403);
  }
}

export class NotFoundError extends ApiError {
  constructor(message = "Resource not found.") {
    super(message, 404);
  }
}
