import { User } from '../user/user';
import CardType, { CardToAdd } from './card';

export default interface AddCardDto {
  boardId: string;

  colIdToAdd: string;

  card: CardToAdd;

  socketId?: string;

  newCard?: CardType;

  user?: User;
}
