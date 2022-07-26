export class BoardNotValidError extends Error {
  constructor() {
    super('Board is not valid');
  }
}
