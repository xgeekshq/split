enum AuthErrorEnumMessages {
  DEFAULT = 'There was a connection error, please try again.',
  EMAIL_EXISTS = 'This email already exists.',
  INVALID_CREDENTIALS = 'The username or password you have entered is invalid.',
}

export const getAuthError = (code: number) => {
  switch (code) {
    case 401:
      return AuthErrorEnumMessages.INVALID_CREDENTIALS;
    case 400:
      return AuthErrorEnumMessages.EMAIL_EXISTS;
    default:
      return AuthErrorEnumMessages.DEFAULT;
  }
};

export default AuthErrorEnumMessages;
