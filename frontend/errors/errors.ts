interface ErrorsI {
  [idx: string]: string;
}

export const errors: ErrorsI = {
  EMAIL_EXISTS:
    "Registration failed. Please check if you are already registered, otherwise contact support for more info",
};

export const getMessageFromErrorCode = (errorCode: string): string => {
  return errors[errorCode];
};
