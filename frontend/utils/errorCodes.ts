export const errorCodes = (message: string): number =>
  Number(message.slice(message.length - 3, message.length));
