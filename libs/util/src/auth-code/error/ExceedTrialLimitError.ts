export class ExceedTrialLimitError extends Error {
  constructor() {
    super('Exceeded trial limit, try after 1 hour');
  }
}
