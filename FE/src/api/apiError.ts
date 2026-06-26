export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors?: Record<string, string[]>;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
  isValidationError(): boolean {
    return this.statusCode === 422;
  }

  isUnauthorized(): boolean {
    return this.statusCode === 401;
  }
}
