export class CommandForbiddenError extends Error {
  constructor(message: string) {
    super(message);
  }
}
