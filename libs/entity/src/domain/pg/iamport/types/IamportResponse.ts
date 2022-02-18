import 'reflect-metadata';
import { Exclude, Type } from 'class-transformer';

type Class = { new (...args: any[]): any };

export class IamportResponse<T> {
  @Exclude()
  private type: Class;

  code: number;
  message: string | null;

  @Type((options) => {
    return (options.newObject as IamportResponse<T>).type;
  })
  response: T;

  constructor(type: Class) {
    this.type = type;
  }
}
