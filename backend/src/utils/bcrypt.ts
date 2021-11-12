import * as bcrypt from 'bcrypt';
import { SALT } from '../constants/encrypt';

export const encrypt = (textToEncrypt: string) => {
  return bcrypt.hash(textToEncrypt, SALT);
};

export const compare = (plainText: string, hashedString: string) => {
  return bcrypt.compare(plainText, hashedString);
};
