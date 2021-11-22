export const USER_NOT_FOUND = Symbol();
export const INVALID_CREDENTIALS = Symbol();

export const EMAIL_EXISTS = Symbol();
export const EMAIL_NOT_EXISTS = Symbol();

export const BOARD_NOT_FOUND = Symbol();
export const BOARDS_NOT_FOUND = Symbol();

export function describeExceptions(key: symbol): string {
  switch (key) {
    case USER_NOT_FOUND:
      return 'USER_NOT_FOUND';
    case INVALID_CREDENTIALS:
      return 'INVALID_CREDENTIALS';
    case EMAIL_EXISTS:
      return 'EMAIL_EXISTS';
    case EMAIL_NOT_EXISTS:
      return 'EMAIL_NOT_EXISTS';
    case BOARD_NOT_FOUND:
      return 'BOARD_NOT_FOUND';
    case BOARDS_NOT_FOUND:
      return 'BOARDS_NOT_FOUND';
  }
}
