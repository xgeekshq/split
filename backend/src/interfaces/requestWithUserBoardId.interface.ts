import RequestWithUser from './requestWithUser.interface';

export default interface RequestWithUserBoardId extends RequestWithUser {
  id: string;
}
