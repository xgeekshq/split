export const hideText = (text: string): string => {
  return text.replace(/[a-zA-Z0-9'#]/g, 'a');
};
