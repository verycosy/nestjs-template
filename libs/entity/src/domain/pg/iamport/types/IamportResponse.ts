export interface IamportResponse<T> {
  code: number;
  message: string | null;
  response: T;
}
