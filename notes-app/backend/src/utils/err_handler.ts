export class ErrorHandler extends Error {
  statusCode: number;
  data: any;
  errors: any[];
  success: boolean;
  logLevel: string;

  constructor(
    message: string = "Something went wrong!",
    statusCode: number = 500,
    data: any = {},
    errors: any[] = [],
    stack: string = "",
    logLevel: string = "error",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
    this.success = false;
    this.logLevel = logLevel;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
