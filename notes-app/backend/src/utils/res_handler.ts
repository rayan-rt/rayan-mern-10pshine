export class ResponseHandler {
  message: string;
  statusCode: number;
  data: any;
  success: boolean;

  constructor(message: string, statusCode: number = 200, data: any = {}) {
    this.message = message;
    this.statusCode = statusCode;
    this.data = data;
    this.success = statusCode >= 200 && statusCode < 300;
  }
}
