import { User } from '../user/user';

export default interface CommentType {
  _id: string;
  text: string;
  createdBy: User;
  isNested?: boolean;
  anonymous: boolean;
}
