import { Exclude } from 'class-transformer';
import { ResponseStatus } from './ResponseStatus';

export class ResponseEntity<T> {
  @Exclude() private readonly _statusCode: ResponseStatus;
  @Exclude() private readonly _message: string;
  @Exclude() private readonly _data: T;

  private constructor(status: ResponseStatus, message: string, data: T) {
    this._statusCode = ResponseStatus[status];
    this._message = message;
    this._data = data;
  }

  static OK(): ResponseEntity<string> {
    return new ResponseEntity<string>(ResponseStatus.OK, '', '');
  }

  static OK_WITH<T>(data: T): ResponseEntity<T> {
    return new ResponseEntity<T>(ResponseStatus.OK, '', data);
  }

  static ERROR(): ResponseEntity<string> {
    return new ResponseEntity<string>(
      ResponseStatus.SERVER_ERROR,
      'Server Error Occured',
      '',
    );
  }

  static ERROR_WITH(
    message: string,
    code: ResponseStatus = ResponseStatus.SERVER_ERROR,
  ): ResponseEntity<string> {
    return new ResponseEntity<string>(code, message, '');
  }

  static ERROR_WITH_DATA<T>(
    message: string,
    code: ResponseStatus = ResponseStatus.SERVER_ERROR,
    data: T,
  ): ResponseEntity<T> {
    return new ResponseEntity<T>(code, message, data);
  }

  get statusCode(): string {
    return this._statusCode;
  }

  get message(): string {
    return this._message;
  }

  get data(): T {
    return this._data;
  }
}
