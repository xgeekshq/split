export const USER_NOT_FOUND = Symbol('user not found');
export const INVALID_CREDENTIALS = Symbol('invalid credentials');

export const EMAIL_EXISTS = Symbol('email exists');
export const EMAIL_NOT_EXISTS = Symbol('email does not exist');
export const EMAIL_DONT_MATCH = Symbol('emails does not match');

export const BOARD_NOT_FOUND = Symbol('board not found');
export const BOARDS_NOT_FOUND = Symbol('boards not found');

export const TOKENS_NOT_MATCHING = Symbol('tokens not match');

export const UNAUTHORIZED = Symbol('unauthorized');
export const UPDATE_FAILED = Symbol('update failed');

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
    case TOKENS_NOT_MATCHING:
      return 'TOKENS_NOT_MATCHING';
    case UNAUTHORIZED:
      return 'UNAUTHORIZED';
    case UPDATE_FAILED:
      return 'UPDATE_FAILED';
    default:
      return 'ERROR';
  }
}
