export const ForgotPassword = {
  SENT_RECENTLY: 'EMAIL_SENT_RECENTLY',
  CHECK_EMAIL: 'please check your email',
};

export const SuccessMessages = {
  RESET_PASSWORD: 'Password updated successfully.',
} as const;

export const InfoMessages = {
  RESET_TOKEN: (message: string) => {
    if (message === ForgotPassword.SENT_RECENTLY) {
      return 'Email was sent recently please wait 1 minute and try again';
    } else if (message === ForgotPassword.CHECK_EMAIL) {
      return 'Another link was sent to your email';
    }
    return '';
  },
} as const;

export const ErrorMessages = {
  AUTH: (code: number) => {
    switch (code) {
      case 401:
        return 'The username or password you have entered is invalid.';
      case 400:
        return 'This email already exists.';
      default:
        return 'There was a connection error, please try again.';
    }
  },
  GUEST_USER: 'Error login guest user.',
  RESET_PASSWORD: 'Something went wrong, please try again.',
} as const;
