import * as bcrypt from 'bcrypt';
import { SALT } from 'src/constants/encrypt';

const encryptPassword = (textToEncrypt: string) => {
  return bcrypt.hash(textToEncrypt, SALT);
};

export default encryptPassword;
