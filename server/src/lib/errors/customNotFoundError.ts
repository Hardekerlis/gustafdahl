import { CustomError } from './customError';

export class CustomNotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomNotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
