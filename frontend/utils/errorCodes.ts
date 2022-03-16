export const transformLoginErrorCodes = (message: string): number => {
  const code = Number(message.slice(message.length - 3, message.length));
  return code === 200 ? 102 : code;
};
