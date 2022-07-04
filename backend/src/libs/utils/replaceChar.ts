export const replaceChar = (text: string) => {
  return text.replace(/[a-z0-9'#]/g, 'a').replace(/[A-Z]/g, 'A');
};
