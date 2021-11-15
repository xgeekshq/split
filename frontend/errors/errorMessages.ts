interface ErrorsI {
  [idx: string]: string;
}

const ErrorMessages: ErrorsI = {
  DEFAULT: "An error occurred. Please check your internet connection.",
  EMAIL_EXISTS:
    "Registration failed. Please check if you are already registered, otherwise contact support for more info",
  INVALID_CREDENTIALS: "Login failed. Please, make sure you entered the right credentials.",
};

export default ErrorMessages;
